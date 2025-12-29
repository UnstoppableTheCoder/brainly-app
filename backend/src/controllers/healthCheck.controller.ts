import logger from "../config/logger.config.js";
import type { HealthCheck } from "../types/healthCheck.types.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const healthCheck = asyncHandler((req, res) => {
  logger.info("healthCheck Controller: Server is up and running");
  res.status(200).json(
    new ApiResponse<HealthCheck>(200, "Server is up and running", {
      message: "ok",
    })
  );
});
