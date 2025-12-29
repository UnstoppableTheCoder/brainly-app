import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "../validators/user.validator.js";
import User from "../models/user.model.js";
import crypto from "crypto";
import {
  BASE_SEND_MAIL_DELAY_MS,
  FORGOT_PASSWORD_TOKEN_EXPIRY_MS,
  FORGOT_PASSWORD_TOKEN_LENGTH,
  MAX_SEND_MAIL_RETRIES,
  VERIFICATION_TOKEN_EXPIRY_MS,
  VERIFICATION_TOKEN_LENGTH,
} from "../constants/auth.constants.js";
import removeSensitiveData from "../helpers/sensitiveData.helper.js";
import logger from "../config/logger.config.js";
import ApiResponse from "../utils/ApiResponse.js";
import { type signupRes } from "../types/controllers/user/signupResponse.types.js";
import {
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendResetPasswordEmail,
} from "../helpers/mail.helper.js";
import {
  clearAuthCookie,
  setAuthCookie,
} from "../services/authCookie.service.js";
import type { loginRes } from "../types/controllers/user/loginResponse.types.js";
import { type verifyRes } from "../types/controllers/user/verifyResponse.types.js";
import type { profileRes } from "../types/controllers/user/profileResponse.types.js";
import type { changePasswordRes } from "../types/controllers/user/changePasswordResponse.types.js";
import type { DeleteAccountRes } from "../types/controllers/user/deleteAccountResponse.types.js";
import type { sendEmailVerificationLinkRes } from "../types/controllers/user/sendEmailVerificationLinkResponse.types.js";

export const signupUser = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const { error, value } = signupSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details[0]?.message || "Validation failed";
    throw new ApiError(400, errorMessage);
  }

  const { name, email, password, role = "user" } = value;

  // Check if user already exists
  const existingUser = await User.findOne({ email }).select("_id");
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Generate verification token
  const verificationToken = crypto
    .randomBytes(VERIFICATION_TOKEN_LENGTH)
    .toString("hex");
  const verificationTokenExpiry = new Date(
    Date.now() + VERIFICATION_TOKEN_EXPIRY_MS
  );

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
    verificationTokenExpiry,
  });

  // Remove sensitive data
  const createdUser = removeSensitiveData(user.toObject());

  // Send verification email (async, non-blocking)
  let isEmailSent = false;

  try {
    isEmailSent = await sendVerificationEmail({
      email: createdUser.email,
      token: verificationToken,
      maxRetries: MAX_SEND_MAIL_RETRIES,
      baseDelayMs: BASE_SEND_MAIL_DELAY_MS,
    });

    if (!isEmailSent) {
      logger.warn("Verification email failed to send", {
        email: createdUser.email,
        userId: createdUser._id,
      });
    }
  } catch (error) {
    // Log error but don't fail registration
    logger.error("Email sending error during signup", {
      email: createdUser.email,
      userId: createdUser._id,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }

  // Log successful signup
  logger.info("User registered successfully", {
    userId: createdUser._id,
    email: createdUser.email,
    isEmailSent,
  });

  // Return response
  const message = isEmailSent
    ? "User registered successfully. Please check your email to verify your account."
    : "User registered successfully, but verification email failed to send. Please request a new verification email.";

  return res.status(201).json(
    new ApiResponse<signupRes>(201, message, {
      user: createdUser,
      isEmailSent,
    })
  );
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details[0]?.message || "Validation failed";
    throw new ApiError(400, errorMessage);
  }

  // Get data
  const { email, password } = value;

  // Check if user already exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Validate Password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    logger.warn("Failed login attempt - invalid password", {
      email,
      userId: user._id,
    });
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate authentication token
  const token = user.generateToken();

  // Get loggedInUser info
  const loggedInUser = removeSensitiveData(user.toObject());

  // Set cookie (Save token in cookie)
  setAuthCookie(res, token);

  logger.info("User logged in successfully", {
    userId: loggedInUser._id,
    email: loggedInUser.email,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  // return response
  return res.status(200).json(
    new ApiResponse<loginRes>(200, "User logged in successfully", {
      user: loggedInUser,
      token,
    })
  );
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Authentication required");
  }

  clearAuthCookie(res);

  logger.info("User logged out", {
    userId: req.user?.id || "Unknown",
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "User logged out successfully"));
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  // Get the token from the params
  const { token } = req.params;
  if (!token) {
    throw new ApiError(400, "Verification token is required");
  }

  // Find the user
  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpiry: { $gt: new Date() },
  });
  if (!user) {
    logger.warn("Verification failed - invalid or expired token", { token });
    throw new ApiError(400, "Invalid or expired verification token");
  }

  // Set the values to undefined
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  user.isVerified = true;
  await user.save();

  // Get verified user info
  const verifiedUser = removeSensitiveData(user.toObject());

  logger.info("User successfully verified", {
    userId: verifiedUser._id,
  });

  return res.status(200).json(
    new ApiResponse<verifyRes>(200, "User account is verified successfully", {
      user: verifiedUser,
    })
  );
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Authentication required");
  }

  const { id: userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Sanitize User
  const sanitizedUser = removeSensitiveData(user.toObject());

  // return response
  return res.status(200).json(
    new ApiResponse<profileRes>(200, "User profile fetched successfully", {
      user: sanitizedUser,
    })
  );
});

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new ApiError(401, "Authentication required");
    }

    const { id: userId } = req.user;

    // Validate request body (oldPassword, newPassword)
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      throw new ApiError(400, error.details[0]?.message || "Validation failed");
    }

    const { oldPassword, newPassword } = value;

    // Retrieve user record
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Validate old password
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid current Password");
    }

    // Update password and save
    user.password = newPassword;
    await user.save();

    // Sanitize user
    const sanitizedUser = removeSensitiveData(user.toObject());

    // return response
    res.status(200).json(
      new ApiResponse<changePasswordRes>(
        200,
        "User password changed successfully",
        {
          user: sanitizedUser,
        }
      )
    );
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    // Validate request body
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error) {
      throw new ApiError(400, error.details[0]?.message || "Validation failed");
    }

    const { email } = value;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // For security, avoid revealing whether the user exists
      // You can either throw 200 with generic message or log this event
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "If the email is registered, you'll receive a password reset link shortly."
          )
        );
    }

    // Generate forgot password token & expiry
    const forgotPasswordToken = crypto
      .randomBytes(FORGOT_PASSWORD_TOKEN_LENGTH)
      .toString("hex");
    const forgotPasswordTokenExpiry = new Date(
      Date.now() + FORGOT_PASSWORD_TOKEN_EXPIRY_MS
    );

    // Update the user with token info
    user.forgotPasswordToken = forgotPasswordToken;
    user.forgotPasswordTokenExpiry = forgotPasswordTokenExpiry;
    await user.save();

    await sendForgotPasswordEmail({
      email,
      token: forgotPasswordToken,
      maxRetries: MAX_SEND_MAIL_RETRIES,
      baseDelayMs: BASE_SEND_MAIL_DELAY_MS,
    });

    // Sanitize the user
    const sanitizedUser = removeSensitiveData(user.toObject());

    // return response
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Email to reset password has been sent successfully"
        )
      );
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    // Get the token
    const { token } = req.params;
    if (!token) {
      throw new ApiError(400, "Reset token is required");
    }

    // Find a user using the token and ensure token is valid and not expired
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: new Date() },
    });
    if (!user) {
      throw new ApiError(401, "Invalid or expired reset token");
    }

    // Validate request body (newPasswords)
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      throw new ApiError(
        400,
        error.details[0]?.message || "Validation failed - Invalid Input"
      );
    }

    // Get new password
    const { newPassword, confirmPassword } = value;

    if (newPassword !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }

    // change the password
    user.password = newPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user?.save();

    // send an email to the user
    await sendResetPasswordEmail({
      email: user.email,
      name: user.name,
      maxRetries: MAX_SEND_MAIL_RETRIES,
      baseDelayMs: BASE_SEND_MAIL_DELAY_MS,
    });

    // Remove sensitive data from user
    const sanitizedUser = removeSensitiveData(user.toObject());

    return res.status(200).json(
      new ApiResponse(200, "Password reset successfully", {
        user: sanitizedUser,
      })
    );
  }
);

export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, "Authentication is required");
  }

  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new ApiError(400, "User not found or authentication is required");
  }

  const sanitizedDeletedUser = removeSensitiveData(deletedUser.toObject());

  logger.info("User account deleted successfully", {
    email: deletedUser.email,
    id: deletedUser._id,
  });

  return res.status(200).json(
    new ApiResponse<DeleteAccountRes>(
      200,
      "User account deleted successfully",
      {
        user: sanitizedDeletedUser,
      }
    )
  );
});

export const sendEmailVerificationLink = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Authentication is required");
    }

    // Check if user already exists
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // For the response
    const sanitizedUser = removeSensitiveData(user.toObject());

    if (user.isVerified) {
      return res.status(200).json(
        new ApiResponse<sendEmailVerificationLinkRes>(
          200,
          "The email is already verified",
          {
            user: sanitizedUser,
            isEmailSent: false,
          }
        )
      );
    }

    // Generate verification token
    const verificationToken = crypto
      .randomBytes(VERIFICATION_TOKEN_LENGTH)
      .toString("hex");
    const verificationTokenExpiry = new Date(
      Date.now() + VERIFICATION_TOKEN_EXPIRY_MS
    );

    // Save verification token & expiry in db
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    // Send verification email (async, non-blocking)
    let isEmailSent = false;
    try {
      isEmailSent = await sendVerificationEmail({
        email: user.email,
        token: verificationToken,
        maxRetries: MAX_SEND_MAIL_RETRIES,
        baseDelayMs: BASE_SEND_MAIL_DELAY_MS,
      });

      if (!isEmailSent) {
        logger.warn("Verification email failed to send", {
          email: user.email,
          userId: user._id,
        });
      }
    } catch (error) {
      // Log error but don't fail registration
      logger.error("Email sending error during signup", {
        email: user.email,
        userId: user._id,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }

    logger.info("Verification email sent successfully", {
      userId: user._id,
      email: user.email,
      isEmailSent,
    });

    // Return response
    const message = isEmailSent
      ? "Please check your email to verify your account."
      : "Verification email failed to send. Please request a new verification email.";

    // Return response
    return res.status(201).json(
      new ApiResponse<sendEmailVerificationLinkRes>(201, message, {
        user: sanitizedUser,
        isEmailSent,
      })
    );
  }
);
