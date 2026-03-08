import {
  registerUser,
  registerAdminAndSchool,
  loginUser,
  refreshAuthSession,
  logoutUser,
} from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../utils/authCookies.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body, {
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  });

  setRefreshTokenCookie(res, result.refreshToken);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: result.user,
      accessToken: result.accessToken,
      tokenType: "Bearer",
      accessTokenExpiresIn: result.accessTokenExpiresIn,
    },
  });
});

export const adminSignup = asyncHandler(async (req, res) => {
  const result = await registerAdminAndSchool(req.body, {
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  });

  setRefreshTokenCookie(res, result.refreshToken);

  res.status(201).json({
    success: true,
    message: "School and admin account created successfully",
    data: {
      user: result.user,
      school: result.school,
      accessToken: result.accessToken,
      tokenType: "Bearer",
      accessTokenExpiresIn: result.accessTokenExpiresIn,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body, {
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  });

  setRefreshTokenCookie(res, result.refreshToken);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: result.user,
      accessToken: result.accessToken,
      tokenType: "Bearer",
      accessTokenExpiresIn: result.accessTokenExpiresIn,
    },
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  const result = await refreshAuthSession(incomingRefreshToken, {
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  });

  setRefreshTokenCookie(res, result.refreshToken);

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: {
      user: result.user,
      accessToken: result.accessToken,
      tokenType: "Bearer",
      accessTokenExpiresIn: result.accessTokenExpiresIn,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (incomingRefreshToken) {
    await logoutUser(incomingRefreshToken);
  }

  clearRefreshTokenCookie(res);

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});
