import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { unauthorized } from "../utils/errors.js";
import { verifyAccessToken } from "../utils/token.js";

export const authMiddleware = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw unauthorized("Authentication token is required");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select("-password");

    if (!user || !user.isActive) {
      throw unauthorized("User associated with this token no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    throw unauthorized("Invalid or expired token");
  }
});

export const protect = authMiddleware;

export default authMiddleware;
