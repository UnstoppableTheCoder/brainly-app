import Link from "../models/link.model.js";
import type {
  FetchLinkRes,
  GenerateLinkRes,
} from "../types/controllers/link/generateLinkResponse.types.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateLinkSchema } from "../validators/link.validator.js";
import crypto from "crypto";

const generateLink = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, "Authentication is required");
  }

  // Validate request body
  const result = generateLinkSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    throw new ApiError(400, "Validation Error", errors);
  }

  const { share } = result.data;
  const existingLink = await Link.findOne({ userId });

  if (share) {
    if (existingLink) {
      return res.status(200).json(
        new ApiResponse<GenerateLinkRes>(200, "Share link already exists", {
          link: existingLink,
          url: `http://localhost:5173/contents/${existingLink.hash}`,
        })
      );
    }

    const hash = crypto.randomBytes(32).toString("hex");
    const link = await Link.create({ hash, userId });

    return res
      .status(201)
      .json(
        new ApiResponse<GenerateLinkRes>(
          201,
          "Share link created successfully",
          { link, url: `http://localhost:5173/contents/${link.hash}` }
        )
      );
  } else {
    // share - false, link -> delete, !link -> done
    if (!existingLink) {
      throw new ApiError(404, "Link not found");
    }

    const deletedLink = await Link.findOneAndDelete({ userId });
    if (!deletedLink) {
      throw new ApiError(404, "Link not found or user is not authenticated");
    }

    return res.status(200).json(
      new ApiResponse<GenerateLinkRes>(200, "Link removed successfully", {
        link: deletedLink,
        url: null,
      })
    );
  }
});

const fetchLink = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, "Authentication is required");
  }

  const link = await Link.findOne({ userId });
  if (!link) {
    throw new ApiError(404, "Link does not exist");
  }

  return res.status(200).json(
    new ApiResponse<FetchLinkRes>(200, "Link fetched successfully", {
      link,
      url: `http://localhost:5173/contents/${link.hash}`,
    })
  );
});

export { generateLink, fetchLink };
