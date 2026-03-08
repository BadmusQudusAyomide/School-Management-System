import Student from "../models/Student.js";
import User from "../models/User.js";
import { badRequest, notFound } from "../utils/errors.js";
import { generateAdmissionNumber } from "./admissionNumberService.js";

const getScopedStudentUserIds = async (schoolId) => {
  const users = await User.find({ schoolId, role: "student" }).select("_id");
  return users.map((user) => user._id);
};

const ensureStudentUser = async (userId, schoolId) => {
  const user = await User.findOne({ _id: userId, schoolId, role: "student" });
  if (!user) {
    throw badRequest("Student user must exist in the same school with role student");
  }
  return user;
};

export const getStudents = async (currentUser) => {
  const userIds = await getScopedStudentUserIds(currentUser.schoolId);
  return Student.find({ userId: { $in: userIds } })
    .populate("userId", "-password")
    .populate("class")
    .populate("parentId");
};

export const getStudentById = async (id, currentUser) => {
  const student = await Student.findById(id)
    .populate("userId", "-password")
    .populate("class")
    .populate("parentId");

  if (!student) {
    throw notFound("Student not found");
  }

  if (String(student.userId.schoolId) !== String(currentUser.schoolId)) {
    throw notFound("Student not found");
  }

  return student;
};

export const createStudent = async (payload, currentUser) => {
  await ensureStudentUser(payload.userId, currentUser.schoolId);
  return Student.create({
    ...payload,
    admissionNumber: await generateAdmissionNumber(currentUser.schoolId),
  });
};

export const updateStudent = async (id, payload, currentUser) => {
  const student = await getStudentById(id, currentUser);

  if (payload.userId && String(payload.userId) !== String(student.userId._id)) {
    await ensureStudentUser(payload.userId, currentUser.schoolId);
  }

  const fields = [
    "userId",
    "class",
    "section",
    "dateOfBirth",
    "gender",
    "parentId",
    "address",
    "feesStatus",
  ];

  for (const field of fields) {
    if (payload[field] !== undefined) {
      student[field] = payload[field];
    }
  }

  await student.save();
  return getStudentById(id, currentUser);
};

export const deleteStudent = async (id, currentUser) => {
  const student = await getStudentById(id, currentUser);
  await Student.findByIdAndDelete(student._id);
  return { id };
};
