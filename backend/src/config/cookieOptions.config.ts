import type { cookieOptionsType } from "../types/controllers/user/cookieOptions.types.js";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Cookie configuration optimized for both development and production
 *
 * Development:
 * - secure: false (allows HTTP)
 * - sameSite: 'lax' (better for local testing)
 *
 * Production:
 * - secure: true (HTTPS only)
 * - sameSite: 'none' (required for cross-origin with secure flag)
 */
const cookieOptions: cookieOptionsType = {
  httpOnly: true, // Prevents XSS attacks
  secure: isProduction, // HTTPS only in production
  sameSite: isProduction ? "none" : "lax", // Cross-site protection
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds

  // Optional: Specify domain for production (subdomain sharing)
  ...(isProduction &&
    process.env.COOKIE_DOMAIN && {
      domain: process.env.COOKIE_DOMAIN,
    }),
};

export default cookieOptions;
