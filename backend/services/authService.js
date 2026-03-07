import User from "../models/User.js";
import { signToken } from "../utils/token.js";
import { conflict, unauthorized } from "../utils/errors.js";

const sanitizeUser = (user) => ({
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
});

export const registerUser = async ({
  name,
  email,
  password,
  role,
  phone,
  profilePicture,
  schoolId,
}) => {
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

  return {
    user: sanitizeUser(user),
    token: signToken(user._id.toString()),
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw unauthorized("Invalid email or password");
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    throw unauthorized("Invalid email or password");
  }

  return {
    user: sanitizeUser(user),
    token: signToken(user._id.toString()),
  };
};
