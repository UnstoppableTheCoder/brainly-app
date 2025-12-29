import type { sanitizedUser } from "../../sanitizedUser.types.js";

interface signupRes {
  user: sanitizedUser;
  isEmailSent: boolean;
}

export type { signupRes };
