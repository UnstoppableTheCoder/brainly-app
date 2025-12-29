import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";
import type { ErrorsType } from "../types/utils/ApiError.types.js";

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error: ApiError;

  if (err instanceof ApiError) {
    error = err;
  } else {
    let statusCode = 500;
    let message = err.message || "Something went wrong";
    let errors: ErrorsType[] = [];

    // Mongoose validation error
    if (err instanceof mongoose.Error.ValidationError) {
      statusCode = 400;
      message = "Validation failed";
      errors = Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
    }
    // Mongoose cast error (invalid ObjectId)
    else if (err instanceof mongoose.Error.CastError) {
      statusCode = 400;
      message = `Invalid ${err.path}: ${err.value}`;
    }
    // Duplicate key error (MongoDB)
    else if ((err as any).code === 11000) {
      statusCode = 409;
      const field = Object.keys((err as any).keyValue || {})[0]; // Figure this thing out
      message = field ? `${field} already exists` : "Duplicate field value";
    }

    error = new ApiError(statusCode, message, errors);
  }

  res.status(error.statusCode).json(error);
};
