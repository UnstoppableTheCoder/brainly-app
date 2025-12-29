import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  addContentSchema,
  updateContentSchema,
} from "../validators/content.validator.js";
import User from "../models/user.model.js";
import Content from "../models/content.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import Tag from "../models/tag.model.js";
import type { Types } from "mongoose";
import logger from "../config/logger.config.js";
import mongoose from "mongoose";
import type { addContentRes } from "../types/controllers/content/addContentResponse.types.js";
import type { GetContentsRes } from "../types/controllers/content/getContentsResponse.types.js";
import type { UpdateContentRes } from "../types/controllers/content/updateContentResponse.types.js";
import type { DeleteContentRes } from "../types/controllers/content/deleteContentResponse.types.js";
import Link from "../models/link.model.js";

export const addContent = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Authentication Check
    if (!req.user?.id) {
      throw new ApiError(401, "Authentication required");
    }

    const { id: userId } = req.user;

    // Validate request body
    const result = addContentSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new ApiError(400, "Validation Error", errors);
    }

    // Get the payload
    const { title, link, linkType, tags } = result.data;

    // Check if the user exists
    const userExits = await User.exists({ _id: userId });
    if (!userExits) {
      throw new ApiError(404, "User not found.");
    }

    // Tags -
    // Get all the existing tags from db that match tags from req.body
    // Create groups of their names & ids -> tagIds
    // Filter the new tags that aren't saved in db yet
    // Insert those new tags in db & save ids in tagIds
    let tagIds: Types.ObjectId[] = [];

    if (tags && tags.length > 0) {
      // Find existing Tags
      const existingTags = await Tag.find({ tag: { $in: tags } }).select(
        "_id tag"
      );
      const existingTagNames = new Set(existingTags.map((t) => t.tag));
      tagIds = existingTags.map((t) => t._id);

      // Find new tags that don't exist
      const newTags = tags.filter((tag) => !existingTagNames.has(tag));

      // Create new tags in bulk (if any)
      if (newTags.length > 0) {
        const newTagDocs = await Tag.insertMany(
          newTags.map((tag) => ({ tag })),
          { ordered: false }
        ).catch((err) => {
          if (err.code === 11000) {
            return err.insertedDoc || [];
          }

          throw err;
        });

        // Add new tag ids
        if (Array.isArray(newTagDocs)) {
          tagIds.push(...newTagDocs.map((t) => t._id));
        }
      }

      // Create Content
      const content = await Content.create({
        title,
        link,
        linkType,
        tags: tagIds,
        userId,
      });

      await content.populate("tags", "tag");

      logger.info("Content created successfully", {
        contentId: content._id,
        userId,
        title,
      });

      // return response
      return res.status(201).json(
        new ApiResponse<addContentRes>(201, "Content created successfully", {
          content,
        })
      );
    }
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export const getContents = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Authentication required");
  }

  const { id: userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const contents = await Content.find({ userId })
    .populate("tags", "tag")
    .lean() // return plain JS objects for better performance
    .exec();

  return res.status(200).json(
    new ApiResponse<GetContentsRes>(201, "Contents fetched successfully", {
      contents,
    })
  );
});

export const updateContent = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Authentication is required");
  }

  const { id: userId } = req.user;
  const { contentId } = req.params;

  if (!contentId) {
    throw new ApiError(400, "Content id is required");
  }

  // Validate request body (title, link, linkType, tags)
  const result = updateContentSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    throw new ApiError(400, "Validation Error", errors);
  }

  const { title, link, linkType, tags } = result.data;

  // Find existing tags and gather their objectIds
  const existingTags = await Tag.find({ tag: { $in: tags } })
    .select("_id tag")
    .lean();
  const tagsIds = existingTags.map((t) => t._id);
  const existingTagsNames = new Set(existingTags.map((t) => t.tag));

  // Create new tag documents for any missing tags
  const newTags = tags.filter((t) => !existingTagsNames.has(t));
  if (newTags.length > 0) {
    const newTagsDocs = await Tag.insertMany(
      newTags.map((tag) => ({ tag })),
      { ordered: false }
    );

    tagsIds.push(...newTagsDocs.map((t) => t._id));
  }

  // Update the content document, and return the updated one with populated tags
  const updatedContent = await Content.findOneAndUpdate(
    { _id: contentId, userId },
    { $set: { title, link, linkType, tags: tagsIds } },
    { new: true }
  ).populate("tags", "tag");

  if (!updatedContent) {
    throw new ApiError(404, "Content not found or user not authorized");
  }

  return res.status(200).json(
    new ApiResponse<UpdateContentRes>(200, "Content updated successfully", {
      content: updatedContent,
    })
  );
});

export const deleteContent = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  const { contentId } = req.params;
  if (!contentId) {
    throw new ApiError(400, "Content id is required");
  }

  const deletedContent = await Content.findOneAndDelete({
    _id: contentId,
    userId,
  });

  if (!deletedContent) {
    throw new ApiError(404, "Content not found or not authorized");
  }

  return res.status(200).json(
    new ApiResponse<DeleteContentRes>(200, "Content deleted successfully", {
      content: deletedContent,
    })
  );
});

export const getContentsByLink = asyncHandler(async (req, res) => {
  const { hash } = req.params;
  if (!hash || typeof hash !== "string" || hash.trim() === "") {
    throw new ApiError(400, "A valid link hash is required");
  }

  // Find the link document
  const link = await Link.findOne({ hash }).lean();
  if (!link) {
    throw new ApiError(404, "Link does not exist");
  }

  const contents = await Content.find({ userId: link.userId })
    .populate("tags", "tag")
    .lean();

  logger.info("Contents fetched for hash", { hash, userId: link.userId });

  return res.status(200).json(
    new ApiResponse<GetContentsRes>(200, "Contents fetched successfully", {
      contents,
    })
  );
});
