import { env } from "../config/env.js";
import { verifyRefreshToken } from "./token.js";

const baseCookieOptions = {
  httpOnly: true,
  secure: env.cookie.secure,
  sameSite: env.cookie.sameSite,
  domain: env.cookie.domain,
  path: "/",
};

export const setRefreshTokenCookie = (res, refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);

  res.cookie("refreshToken", refreshToken, {
    ...baseCookieOptions,
    expires: new Date(decoded.exp * 1000),
  });
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", baseCookieOptions);
};
