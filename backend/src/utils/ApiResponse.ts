export default class ApiResponse<T = unknown> {
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data: T | null;
  public readonly success: boolean;

  constructor(
    statusCode: number = 200,
    message: string = "OK",
    data: T | null = null,
    success?: boolean
  ) {
    if (
      typeof statusCode !== "number" ||
      statusCode < 100 ||
      statusCode >= 400
    ) {
      throw new Error("Invalid status code for ApiResponse (should be <400)");
    }

    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = typeof success === "boolean" ? success : statusCode < 400;
  }

  public toJSON(): {
    statusCode: number;
    success: boolean;
    message: string;
    data: T | null;
  } {
    return {
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
      data: this.data,
    };
  }
}
