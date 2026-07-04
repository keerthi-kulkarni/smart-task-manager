import User from "../models/User.js";
import { createActivityLog } from "../services/activityService.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { clearTokenCookie, sendTokenCookie } from "../utils/jwt.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

const sendAuthResponse = (res, statusCode, user) => {
  sendTokenCookie(res, user._id);

  res.status(statusCode).json({
    user
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409);
  }

  const user = await User.create({ name, email, password });

  await createActivityLog({
    userId: user._id,
    action: "registered",
    entity: "user",
    entityId: user._id,
    message: "Account created"
  });

  sendAuthResponse(res, 201, user);
});
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    throw new AppError("No account found with this email.", 404);
  }

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    html: `
      <h2>Reset your password</h2>
      <p>Click below to reset your password.</p>

      <a href="${resetURL}">
        Reset Password
      </a>

      <p>This link expires in 10 minutes.</p>
    `
  });

  res.status(200).json({
    message: "Password reset email sent."
  });
});
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password.", 401);
  }

  await createActivityLog({
    userId: user._id,
    action: "logged_in",
    entity: "user",
    entityId: user._id,
    message: "Signed in"
  });

  user.password = undefined;
  sendAuthResponse(res, 200, user);
});

export const logout = asyncHandler(async (_req, res) => {
  clearTokenCookie(res);

  res.status(200).json({
    message: "Logged out successfully."
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    user: req.user
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  req.user.name = req.body.name;
  await req.user.save();

  await createActivityLog({
    userId: req.user._id,
    action: "updated_profile",
    entity: "user",
    entityId: req.user._id,
    message: "Profile updated"
  });

  res.status(200).json({
    user: req.user
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    throw new AppError("Password is required.", 400);
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  }).select("+password +passwordResetToken +passwordResetExpires");

  if (!user) {
    throw new AppError("Token is invalid or has expired.", 400);
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  await createActivityLog({
    userId: user._id,
    action: "reset_password",
    entity: "user",
    entityId: user._id,
    message: "Password reset via token"
  });

  // Authenticate user after password reset
  user.password = undefined;
  sendAuthResponse(res, 200, user);
});
