import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { unauthorized, forbidden } from "../utils/errors.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw unauthorized("Authentication token is required");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw unauthorized("User associated with this token no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    throw unauthorized("Invalid or expired token");
  }
});

export const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw forbidden("You do not have permission to access this resource");
    }

    next();
  };
};
