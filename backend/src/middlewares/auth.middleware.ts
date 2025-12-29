import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt, { type JwtPayload } from "jsonwebtoken";

const authenticate = asyncHandler((req, res, next) => {
  const token =
    req.cookies?.token ||
    req.header("Authorization")?.replace("Bearer ", "").trim();

  if (!token) {
    throw new ApiError(401, "Token is missing - User is not logged in");
  }

  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    throw new ApiError(
      400,
      "TOKEN_SECRET is not defined in environment variables."
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Token expired. please login again");
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid token");
    }

    throw new ApiError(401, "Authentication failed");
  }

  const { id, role } = decoded;
  req.user = { id, role };
  next();
});

export default authenticate;
