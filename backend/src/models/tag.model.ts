import { model, Schema } from "mongoose";
import type { ITagFields } from "../types/models/tag/ITagFields.types.js";

const tagSchema = new Schema<ITagFields>(
  {
    tag: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, "Tag is required"],
    },
  },
  { timestamps: true }
);

const Tag = model<ITagFields>("Tag", tagSchema);
export default Tag;
