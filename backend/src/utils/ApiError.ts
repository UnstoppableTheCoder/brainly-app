import type { ErrorsType } from "../types/utils/ApiError.types.js";

export default class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: ErrorsType[];
  public readonly data: unknown;
  public readonly success: boolean;
  public readonly stack?: string;

  constructor(
    statusCode: number,
    message: string,
    errors?: ErrorsType[] | null,
    data?: unknown | null,
    stack?: string
  ) {
    // statusCode Validation
    if (
      typeof statusCode !== "number" ||
      statusCode < 400 ||
      statusCode > 599
    ) {
      throw new Error("Invalid status code for ApiError");
    }

    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // know more about it
    this.name = this.constructor.name;

    this.statusCode = statusCode;
    this.errors = Array.isArray(errors) ? errors : [];
    this.data = data ?? null;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else if (process.env.NODE_ENV !== "production") {
      Error.captureStackTrace(this, this.constructor); // know more about it
    }
  }

  public toJSON() {
    const base = {
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
      errors: this.errors,
      data: this.data,
    };
    if (process.env.NODE_ENV !== "production") {
      // Only include stack in non-production
      return { ...base, stack: this.stack };
    }
    return base;
  }
}
