import { model, Schema, type CallbackError } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import roles from "../constants/roles.constants.js";
import type { IUserFields } from "../types/models/user/IUserFields.types.js";
import type { IUserModel } from "../types/models/user/IUserModel.types.js";
import type { IUserMethods } from "../types/models/user/IUserMethods.types.js";
import Content from "./content.model.js";

const userSchema = new Schema<IUserFields, IUserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [6, "Password must be at least 6 characters"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: roles,
      default: "user",
      lowercase: true,
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
  },
  { timestamps: true }
);

// Pre-save middleware to hash the password if modified or new
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const filter = this.getFilter();
    let userId;

    if (filter && filter._id) {
      userId = filter._id;
    } else {
      const user = await this.model.findOne(filter);
      if (!user) {
        return next(); // No user found, nothing to delete
      }
      userId = user._id;
    }

    await Content.deleteMany({ userId });

    return next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Generate jwtToken
userSchema.methods.generateToken = function () {
  const { TOKEN_SECRET, TOKEN_EXPIRY } = process.env;

  if (!TOKEN_EXPIRY || !TOKEN_SECRET) {
    throw new Error(
      "TOKEN_SECRET or TOKEN_EXPIRY is not set in environment variables"
    );
  }

  return jwt.sign({ id: this._id, role: this.role }, TOKEN_SECRET, {
    expiresIn: TOKEN_EXPIRY as any,
  });
};

const User = model<IUserFields, IUserModel>("User", userSchema);
export default User;
