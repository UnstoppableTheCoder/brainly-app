import type { Types } from "mongoose";

type role = "admin" | "user";

interface IUserFields {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  role: role;
  verificationToken?: string | undefined;
  verificationTokenExpiry?: Date | undefined;
  forgotPasswordToken?: string | undefined;
  forgotPasswordTokenExpiry?: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export { type IUserFields };
