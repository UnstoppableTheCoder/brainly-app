import type { Types } from "mongoose";

interface sanitizedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  isVerified: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export { type sanitizedUser };
