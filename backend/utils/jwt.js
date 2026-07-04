import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from environment variables.");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
});

export const sendTokenCookie = (res, userId) => {
  const cookieName = process.env.COOKIE_NAME || "smart_task_token";
  const token = generateToken(userId);

  res.cookie(cookieName, token, getCookieOptions());
};

export const clearTokenCookie = (res) => {
  const cookieName = process.env.COOKIE_NAME || "smart_task_token";

  res.clearCookie(cookieName, {
    ...getCookieOptions(),
    maxAge: undefined
  });
};
