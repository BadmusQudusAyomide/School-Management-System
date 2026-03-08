import ClassModel from "../models/Class.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import { badRequest, notFound } from "../utils/errors.js";

const getScopedTeacherIds = async (schoolId) => {
  const users = await User.find({ schoolId, role: "teacher" }).select("_id");
  const teachers = await Teacher.find({ userId: { $in: users.map((user) => user._id) } }).select("_id");
  return teachers.map((teacher) => teacher._id);
};

const ensureTeacherBelongsToSchool = async (teacherId, schoolId) => {
  const teacher = await Teacher.findById(teacherId).populate("userId", "-password");
  if (!teacher || String(teacher.userId.schoolId) !== String(schoolId)) {
    throw badRequest("Assigned teacher must belong to the same school");
  }
};

export const getClasses = async (currentUser) => {
  const teacherIds = await getScopedTeacherIds(currentUser.schoolId);
  return ClassModel.find({ teacher: { $in: teacherIds } })
    .populate({
      path: "teacher",
      populate: { path: "userId", select: "-password" },
    })
    .populate({
      path: "students",
      populate: { path: "userId", select: "-password" },
    });
};

export const createClass = async (payload, currentUser) => {
  await ensureTeacherBelongsToSchool(payload.teacher, currentUser.schoolId);
  return ClassModel.create(payload);
};

export const updateClass = async (id, payload, currentUser) => {
  const classItem = await ClassModel.findById(id).populate({
    path: "teacher",
    populate: { path: "userId", select: "-password" },
  });

  if (!classItem || String(classItem.teacher.userId.schoolId) !== String(currentUser.schoolId)) {
    throw notFound("Class not found");
  }

  if (payload.teacher) {
    await ensureTeacherBelongsToSchool(payload.teacher, currentUser.schoolId);
  }

  const fields = ["name", "section", "teacher", "students"];
  for (const field of fields) {
    if (payload[field] !== undefined) {
      classItem[field] = payload[field];
    }
  }

  await classItem.save();
  return ClassModel.findById(id)
    .populate({
      path: "teacher",
      populate: { path: "userId", select: "-password" },
    })
    .populate({
      path: "students",
      populate: { path: "userId", select: "-password" },
    });
};

export const deleteClass = async (id, currentUser) => {
  const classItem = await ClassModel.findById(id).populate({
    path: "teacher",
    populate: { path: "userId", select: "-password" },
  });

  if (!classItem || String(classItem.teacher.userId.schoolId) !== String(currentUser.schoolId)) {
    throw notFound("Class not found");
  }

  await ClassModel.findByIdAndDelete(id);
  return { id };
};
