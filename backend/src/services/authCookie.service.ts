import type { Response } from "express";
import cookieOptions from "../config/cookieOptions.config.js";

const setAuthCookie = (res: Response, token: string) => {
  res.cookie("token", token, cookieOptions);
};

const { maxAge, ...clearCookieOptions } = cookieOptions;

const clearAuthCookie = (res: Response) => {
  res.clearCookie("token", clearCookieOptions);
};

export { setAuthCookie, clearAuthCookie };
