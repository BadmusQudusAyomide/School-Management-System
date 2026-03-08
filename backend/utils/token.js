import jwt from "jsonwebtoken";
import crypto from "crypto";

import { env } from "../config/env.js";

export const signAccessToken = (user) =>
  jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      schoolId: user.schoolId?.toString(),
      type: "access",
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtAccessExpiresIn,
    }
  );

export const signRefreshToken = (user) =>
  jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      schoolId: user.schoolId?.toString(),
      type: "refresh",
      jti: crypto.randomUUID(),
    },
    env.jwtRefreshSecret,
    {
      expiresIn: env.jwtRefreshExpiresIn,
    }
  );

export const verifyAccessToken = (token) => {
  const payload = jwt.verify(token, env.jwtSecret);

  if (payload.type !== "access") {
    throw new Error("Invalid access token type");
  }

  return payload;
};

export const verifyRefreshToken = (token) => {
  const payload = jwt.verify(token, env.jwtRefreshSecret);

  if (payload.type !== "refresh") {
    throw new Error("Invalid refresh token type");
  }

  return payload;
};

export const getRefreshTokenExpiryDate = () => {
  const now = new Date();
  now.setDate(now.getDate() + 7);
  return now;
};
