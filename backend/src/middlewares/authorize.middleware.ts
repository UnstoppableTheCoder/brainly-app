import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError.js";

const authorizeRoles =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    // Check if user exists
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const { role } = req.user;
    // Check if role exists
    if (!role) {
      throw new ApiError(403, "User role not found");
    }

    // Normalize
    const normalizedRole = role.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map((r) => r.toLowerCase());

    if (!normalizedAllowedRoles.includes(normalizedRole)) {
      throw new ApiError(
        403,
        `Access denied. Required role: ${allowedRoles.join(" or ")}`
      );
    }

    next();
  };

export default authorizeRoles;
