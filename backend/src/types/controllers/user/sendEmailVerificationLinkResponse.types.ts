import type { sanitizedUser } from "../../sanitizedUser.types.js";

interface sendEmailVerificationLinkRes {
  user: sanitizedUser;
  isEmailSent: boolean;
}

export { type sendEmailVerificationLinkRes };
