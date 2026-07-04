import { body, param } from "express-validator";
import { TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from "../models/Task.js";
import { validate } from "./validationMiddleware.js";

export const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required.").isLength({ max: 80 }),
  body("email").trim().isEmail().withMessage("Please provide a valid email address.").normalizeEmail(),
  body("password")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters long.")
  .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/)
  .withMessage(
    "Password must contain at least one uppercase letter, one number, and one special character."
  ),
  validate
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Please provide a valid email address.").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
  validate
];
export const forgotPasswordValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),
  validate
];
export const resetPasswordValidator = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one number, and one special character."
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match.");
    }
    return true;
  }),
  validate
];
export const updateProfileValidator = [
  body("name").trim().notEmpty().withMessage("Name is required.").isLength({ max: 80 }),
  validate
];

export const taskIdValidator = [
  param("id").isMongoId().withMessage("Invalid task id."),
  validate
];

export const createTaskValidator = [
  body("title").trim().notEmpty().withMessage("Task title is required.").isLength({ max: 140 }),
  body("description").optional({ checkFalsy: true }).trim().isLength({ max: 1200 }),
  body("priority").optional().isIn(TASK_PRIORITIES).withMessage("Invalid priority."),
  body("status").optional().isIn(TASK_STATUSES).withMessage("Invalid status."),
  body("category").isIn(TASK_CATEGORIES).withMessage("Invalid category."),
  body("dueDate").isISO8601().withMessage("A valid due date is required."),
  validate
];

export const updateTaskValidator = [
  param("id").isMongoId().withMessage("Invalid task id."),
  body("title").optional().trim().notEmpty().withMessage("Task title cannot be empty.").isLength({ max: 140 }),
  body("description").optional({ checkFalsy: true }).trim().isLength({ max: 1200 }),
  body("priority").optional().isIn(TASK_PRIORITIES).withMessage("Invalid priority."),
  body("status").optional().isIn(TASK_STATUSES).withMessage("Invalid status."),
  body("category").optional().isIn(TASK_CATEGORIES).withMessage("Invalid category."),
  body("dueDate").optional().isISO8601().withMessage("A valid due date is required."),
  validate
];
