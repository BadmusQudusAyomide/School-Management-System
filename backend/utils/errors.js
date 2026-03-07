class AppError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const badRequest = (message, errors = null) => new AppError(message, 400, errors);
export const unauthorized = (message, errors = null) => new AppError(message, 401, errors);
export const forbidden = (message, errors = null) => new AppError(message, 403, errors);
export const notFound = (message, errors = null) => new AppError(message, 404, errors);
export const conflict = (message, errors = null) => new AppError(message, 409, errors);

export default AppError;
