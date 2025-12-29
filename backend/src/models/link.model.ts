import { model, Schema, Types } from "mongoose";
import type { LinkType } from "../types/link.types.js";

const linkSchema = new Schema<LinkType>(
  {
    hash: {
      type: String,
      required: true,
    },
    userId: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Link = model<LinkType>("Link", linkSchema);

export default Link;
