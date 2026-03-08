import User from "../models/User.js";
import { conflict, notFound } from "../utils/errors.js";
import sanitizeUser from "../utils/sanitizeUser.js";

export const getUsers = async (currentUser) => {
  const users = await User.find({ schoolId: currentUser.schoolId }).sort({ createdAt: -1 });
  return users.map(sanitizeUser);
};

export const createUser = async (payload, currentUser) => {
  const existingUser = await User.findOne({
    email: payload.email,
    schoolId: currentUser.schoolId,
  });

  if (existingUser) {
    throw conflict("A user with this email already exists in this school");
  }

  const user = await User.create({
    ...payload,
    schoolId: currentUser.schoolId,
  });

  return sanitizeUser(user);
};

export const updateUser = async (id, payload, currentUser) => {
  const user = await User.findOne({
    _id: id,
    schoolId: currentUser.schoolId,
  }).select("+password");

  if (!user) {
    throw notFound("User not found");
  }

  const fields = ["name", "email", "role", "phone", "profilePicture", "isActive"];
  for (const field of fields) {
    if (payload[field] !== undefined) {
      user[field] = payload[field];
    }
  }

  if (payload.password) {
    user.password = payload.password;
  }

  await user.save();

  return sanitizeUser(user);
};

export const deleteUser = async (id, currentUser) => {
  const user = await User.findOneAndDelete({
    _id: id,
    schoolId: currentUser.schoolId,
  });

  if (!user) {
    throw notFound("User not found");
  }

  return { id };
};
