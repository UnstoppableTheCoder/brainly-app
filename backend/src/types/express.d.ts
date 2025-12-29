import { Request } from "express";
import type { Types } from "mongoose";

declare module "express" {
  export interface Request {
    user?: {
      id: Types.ObjectId;
      role: string;
    };
  }
}
