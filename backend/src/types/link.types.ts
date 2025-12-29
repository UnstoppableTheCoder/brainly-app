import type { Schema, Types } from "mongoose";

interface LinkType {
  _id: Types.ObjectId;
  hash: string;
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export { type LinkType };
