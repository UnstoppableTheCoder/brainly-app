import type { Types } from "mongoose";

interface ContentType {
  _id: Types.ObjectId;
  title: string;
  link: string;
  linkType: "twitter" | "youtube" | "document" | "article" | "other";
  tags: Types.ObjectId[];
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export { type ContentType };
