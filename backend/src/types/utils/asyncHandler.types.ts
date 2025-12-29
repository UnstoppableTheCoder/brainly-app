import type { NextFunction, Request, Response } from "express";

type RequestHandlerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type { RequestHandlerType };
