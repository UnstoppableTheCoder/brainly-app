import { model, Schema } from "mongoose";
import type { IContentDocument } from "../types/models/content/IContentDocument.types.js";

const contentSchema = new Schema<IContentDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxLength: [200, "Title cannot exceed 200 characters"],
    },
    link: {
      type: String,
      required: [true, "Link is required"],
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^https?:\/\/.+/.test(v);
        },
        message: "Link must be a valid URL",
      },
    },
    linkType: {
      type: String,
      required: [true, "linkType is required"],
      enum: {
        values: ["twitter", "youtube", "document", "article", "other"],
        message: "{VALUE} is not a valid link type",
      },
    },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
    },
  },
  { timestamps: true }
);

contentSchema.index({ userId: 1, createdAt: -1 });
contentSchema.index({ tags: 1 });
contentSchema.index({ linkType: 1 });

const Content = model<IContentDocument>("Content", contentSchema);
export default Content;
