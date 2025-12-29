import type { Document, Types } from "mongoose";
import type { IContentFields } from "./IContentFields.types.js";

export interface IContentDocument extends IContentFields, Document {
  _id: Types.ObjectId;
}
