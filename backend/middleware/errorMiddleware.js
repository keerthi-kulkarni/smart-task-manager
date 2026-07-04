import AppError from "../utils/AppError.js";

export const notFound = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler = (error, _req, res, _next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Something went wrong.";

  if (error.name === "CastError") {
    statusCode = 404;
    message = "Resource not found.";
  }

  if (error.code === 11000) {
    statusCode = 409;
    const field = Object.keys(error.keyValue || {})[0] || "field";
    message = `An account with that ${field} already exists.`;
  }

  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session is invalid or has expired.";
  }

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(" ");
  }
console.error({
  name: error.name,
  message: error.message,
  stack: error.stack
});
  res.status(statusCode).json({
    status: `${statusCode}`.startsWith("4") ? "fail" : "error",
    message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined
  });
};
