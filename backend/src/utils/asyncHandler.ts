import type { NextFunction, Request, Response } from "express";
import type { RequestHandlerType } from "../types/utils/asyncHandler.types.js";
import ApiError from "./ApiError.js";

// Utility: Safely extract error message string from various error types
function getErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  return "Unknown error";
}

const asyncHandler =
  (requestHandler: RequestHandlerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      if (err instanceof ApiError) {
        return next(err); // Prevent double error-handling
      }

      // Safely serialize any thrown value
      const fallback = new ApiError(500, "Internal Server Error", [
        { message: getErrorMessage(err) },
      ]);
      next(fallback);
    });
  };

export default asyncHandler;
