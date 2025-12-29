import type { Document } from "mongoose";

type role = "admin" | "user";

export interface User extends Document {
  name: string;
  email: string;
  isVerified: boolean;
  role: role;
}

export interface Profile {
  success: boolean;
  message: string;
  user?: User;
}
