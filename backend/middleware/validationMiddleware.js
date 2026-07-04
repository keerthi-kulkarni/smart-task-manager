import { validationResult } from "express-validator";
import AppError from "../utils/AppError.js";

export const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const message = errors
    .array()
    .map((error) => error.msg)
    .join(" ");

  next(new AppError(message, 400));
};
