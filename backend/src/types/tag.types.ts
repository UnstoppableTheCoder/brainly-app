import type { Document, Types } from "mongoose";

export interface TagType {
  _id: Types.ObjectId;
  tag: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface TagDocument extends TagType, Document {
  _id: Types.ObjectId;
}
