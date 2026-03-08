import crypto from "crypto";

import { env } from "../config/env.js";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Parent from "../models/Parent.js";
import School from "../models/School.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";
import { conflict, unauthorized } from "../utils/errors.js";
const buildRoleMetadata = async (user) => {
  if (user.role === "student") {
    const studentProfile = await Student.findOne({ userId: user._id }).select("_id class parentId");
    return {
      profileId: studentProfile?._id || null,
      classId: studentProfile?.class || null,
      parentId: studentProfile?.parentId || null,
    };
  }

  if (user.role === "teacher") {
    const teacherProfile = await Teacher.findOne({ userId: user._id }).select("_id classes");
    return {
      profileId: teacherProfile?._id || null,
      classIds: teacherProfile?.classes || [],
    };
  }

  if (user.role === "parent") {
    const parentProfile = await Parent.findOne({ userId: user._id }).select("_id children");
    return {
      profileId: parentProfile?._id || null,
      childIds: parentProfile?.children || [],
    };
  }

  return {
    profileId: null,
  };
};


const sanitizeUser = async (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  profilePicture: user.profilePicture,
  schoolId: user.schoolId,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  ...(await buildRoleMetadata(user)),
});

const sanitizeSchool = (school) => ({
  id: school._id,
  name: school.name,
  address: school.address,
  phone: school.phone,
  email: school.email,
  website: school.website,
  timezone: school.timezone,
  currency: school.currency,
  academicYear: school.academicYear,
  createdAt: school.createdAt,
  updatedAt: school.updatedAt,
});

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const buildAuthPayload = async (user, metadata = {}) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const decodedRefreshToken = verifyRefreshToken(refreshToken);

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    tokenId: decodedRefreshToken.jti,
    expiresAt: new Date(decodedRefreshToken.exp * 1000),
    createdByIp: metadata.ipAddress,
    userAgent: metadata.userAgent,
  });

  return {
    user: await sanitizeUser(user),
    accessToken,
    refreshToken,
    accessTokenExpiresIn: env.jwtAccessExpiresIn,
  };
};

export const registerUser = async ({
  name,
  email,
  password,
  role,
  phone,
  profilePicture,
  schoolId,
}, metadata) => {
  const existingUser = await User.findOne({ email, schoolId });

  if (existingUser) {
    throw conflict("A user with this email already exists in this school");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    profilePicture,
    schoolId,
  });

  return buildAuthPayload(user, metadata);
};

export const registerAdminAndSchool = async ({
  schoolName,
  adminFirstName,
  adminLastName,
  adminEmail,
  password,
  schoolAddress,
  schoolPhone,
  timezone,
  currency,
}, metadata) => {
  const session = await User.startSession();

  try {
    let payload;

    await session.withTransaction(async () => {
      const existingUser = await User.findOne({ email: adminEmail }).session(session);
      if (existingUser) {
        throw conflict("An account with this admin email already exists");
      }

      const now = new Date();
      const academicYear = `${now.getFullYear()}/${now.getFullYear() + 1}`;

      const school = await School.create(
        [
          {
            name: schoolName,
            address: schoolAddress,
            phone: schoolPhone,
            email: adminEmail,
            timezone,
            currency,
            academicYear,
          },
        ],
        { session }
      );

      const [createdSchool] = school;

      const user = await User.create(
        [
          {
            name: `${adminFirstName} ${adminLastName}`.trim(),
            email: adminEmail,
            password,
            role: "admin",
            phone: schoolPhone,
            schoolId: createdSchool._id,
          },
        ],
        { session }
      );

      const [createdUser] = user;
      const authPayload = await buildAuthPayload(createdUser, metadata);

      payload = {
        ...authPayload,
        school: sanitizeSchool(createdSchool),
      };
    });

    return payload;
  } finally {
    await session.endSession();
  }
};

export const loginUser = async ({ email, password, schoolId }, metadata) => {
  const query = schoolId ? { email, schoolId } : { email };
  const users = await User.find(query).select("+password");

  if (!users.length) {
    throw unauthorized("Invalid email or password");
  }

  if (!schoolId && users.length > 1) {
    throw unauthorized("Multiple accounts found. Please provide schoolId");
  }

  const [user] = users;

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    throw unauthorized("Invalid email or password");
  }

  if (!user.isActive) {
    throw unauthorized("User account is inactive");
  }

  return buildAuthPayload(user, metadata);
};

export const refreshAuthSession = async (incomingRefreshToken, metadata) => {
  if (!incomingRefreshToken) {
    throw unauthorized("Refresh token is required");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch (error) {
    throw unauthorized("Invalid or expired refresh token");
  }

  const storedToken = await RefreshToken.findOne({
    tokenId: decoded.jti,
    tokenHash: hashToken(incomingRefreshToken),
    revokedAt: null,
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw unauthorized("Refresh token is invalid or expired");
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    throw unauthorized("User associated with this token is unavailable");
  }

  storedToken.revokedAt = new Date();
  await storedToken.save();

  return buildAuthPayload(user, metadata);
};

export const logoutUser = async (incomingRefreshToken) => {
  try {
    const decoded = verifyRefreshToken(incomingRefreshToken);

    await RefreshToken.findOneAndUpdate(
      {
        tokenId: decoded.jti,
        tokenHash: hashToken(incomingRefreshToken),
        revokedAt: null,
      },
      {
        revokedAt: new Date(),
      }
    );
  } catch (_error) {
    return null;
  }

  return null;
};
