import type { sanitizedUser } from "../../sanitizedUser.types.js";

interface loginRes {
  user: sanitizedUser;
  token: string;
}

export { type loginRes };
