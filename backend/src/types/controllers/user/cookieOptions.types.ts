interface cookieOptionsType {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "none" | "lax" | "strict";
  path: string;
  maxAge: number;
}

export { type cookieOptionsType };
