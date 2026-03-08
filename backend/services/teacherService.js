import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import { badRequest, notFound } from "../utils/errors.js";

const getScopedTeacherUserIds = async (schoolId) => {
  const users = await User.find({ schoolId, role: "teacher" }).select("_id");
  return users.map((user) => user._id);
};

const ensureTeacherUser = async (userId, schoolId) => {
  const user = await User.findOne({ _id: userId, schoolId, role: "teacher" });
  if (!user) {
    throw badRequest("Teacher user must exist in the same school with role teacher");
  }
  return user;
};

export const getTeachers = async (currentUser) => {
  const userIds = await getScopedTeacherUserIds(currentUser.schoolId);
  return Teacher.find({ userId: { $in: userIds } })
    .populate("userId", "-password")
    .populate("classes");
};

export const createTeacher = async (payload, currentUser) => {
  await ensureTeacherUser(payload.userId, currentUser.schoolId);
  return Teacher.create(payload);
};

export const updateTeacher = async (id, payload, currentUser) => {
  const teacher = await Teacher.findById(id).populate("userId", "-password");

  if (!teacher || String(teacher.userId.schoolId) !== String(currentUser.schoolId)) {
    throw notFound("Teacher not found");
  }

  if (payload.userId && String(payload.userId) !== String(teacher.userId._id)) {
    await ensureTeacherUser(payload.userId, currentUser.schoolId);
  }

  const fields = ["userId", "employeeId", "subjects", "classes", "qualification", "salary"];
  for (const field of fields) {
    if (payload[field] !== undefined) {
      teacher[field] = payload[field];
    }
  }

  await teacher.save();
  return Teacher.findById(teacher._id).populate("userId", "-password").populate("classes");
};

export const deleteTeacher = async (id, currentUser) => {
  const teacher = await Teacher.findById(id).populate("userId", "-password");

  if (!teacher || String(teacher.userId.schoolId) !== String(currentUser.schoolId)) {
    throw notFound("Teacher not found");
  }

  await Teacher.findByIdAndDelete(id);
  return { id };
};
