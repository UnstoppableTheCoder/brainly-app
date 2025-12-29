function intEnv(key: string, fallback: number): number {
  const val = process.env[key];
  const parsed = parseInt(val || "");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const VERIFICATION_TOKEN_LENGTH = 32;
const VERIFICATION_TOKEN_EXPIRY_MS = intEnv(
  "VERIFICATION_TOKEN_EXPIRY_MS",
  10 * 60 * 1000
);

const FORGOT_PASSWORD_TOKEN_LENGTH = 32;
const FORGOT_PASSWORD_TOKEN_EXPIRY_MS = intEnv(
  "FORGOT_PASSWORD_TOKEN_EXPIRY_MS",
  10 * 60 * 1000
);

const MAX_SEND_MAIL_RETRIES = intEnv("MAX_SEND_EMAIL_RETRIES", 3);
const BASE_SEND_MAIL_DELAY_MS = intEnv("BASE_SEND_EMAIL_DELAY_MS", 500);

export {
  VERIFICATION_TOKEN_LENGTH,
  VERIFICATION_TOKEN_EXPIRY_MS,
  FORGOT_PASSWORD_TOKEN_LENGTH,
  FORGOT_PASSWORD_TOKEN_EXPIRY_MS,
  MAX_SEND_MAIL_RETRIES,
  BASE_SEND_MAIL_DELAY_MS,
};
