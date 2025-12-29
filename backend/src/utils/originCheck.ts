import dotenv from "dotenv";
import logger from "../config/logger.config.js";

dotenv.config();

// Grab allowed origins from ENV (supports comma or newline separated)
const rawOrigins = process.env.ALLOWED_ORIGINS || "";
const allowedOrigins: string[] = rawOrigins
  .split(/[,\n]/)
  .map((origin) => origin.trim().replace(/\/$/, "")) // trims and removes trailing slash
  .filter(Boolean);

// Warn if nothing is set
if (allowedOrigins.length === 0) {
  logger.warn(
    "CORS: No allowed origins set. All cross-origin requests will be blocked unless origin header is absent."
  );
}

// Custom error for blocked origins
class CorsOriginError extends Error {
  constructor(origin: string) {
    super(`CORS policy does not allow origin: ${origin}`);
    this.name = "CorsOriginError";
  }
}

const originCheck = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
): void => {
  if (!origin) {
    logger.info("CORS: No origin header (same origin or non-browser request)");
    return callback(null, true);
  }

  const normalizedOrigin = origin.replace(/\/$/, "");
  if (allowedOrigins.includes(normalizedOrigin)) {
    logger.info(`CORS: Allowed origin: ${origin}`);
    return callback(null, true);
  } else {
    logger.warn(`CORS: Blocked origin: ${origin}`);
    return callback(new CorsOriginError(origin), false);
  }
};

export default originCheck;
