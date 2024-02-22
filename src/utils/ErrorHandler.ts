export class ErrorHandler extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Ensure the class extends built-in Error
    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }
}
