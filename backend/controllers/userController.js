import asyncHandler from "../utils/asyncHandler.js";
import { createUser, deleteUser, getUsers, updateUser } from "../services/userService.js";

export const listUsers = asyncHandler(async (req, res) => {
  const users = await getUsers(req.user);
  res.status(200).json({ success: true, data: users });
});

export const addUser = asyncHandler(async (req, res) => {
  const user = await createUser(req.body, req.user);
  res.status(201).json({ success: true, data: user });
});

export const editUser = asyncHandler(async (req, res) => {
  const user = await updateUser(req.params.id, req.body, req.user);
  res.status(200).json({ success: true, data: user });
});

export const removeUser = asyncHandler(async (req, res) => {
  const result = await deleteUser(req.params.id, req.user);
  res.status(200).json({ success: true, data: result });
});
