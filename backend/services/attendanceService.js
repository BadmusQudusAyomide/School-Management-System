import Attendance from "../models/Attendance.js";
import ClassModel from "../models/Class.js";
import { badRequest, notFound } from "../utils/errors.js";

export const createAttendance = async (payload, currentUser) => {
  const classItem = await ClassModel.findById(payload.class).populate({
    path: "teacher",
    populate: { path: "userId", select: "-password" },
  });

  if (!classItem) {
    throw badRequest("Class not found");
  }

  if (currentUser.role === "teacher" && String(classItem.teacher.userId._id) !== String(currentUser._id)) {
    throw badRequest("Teachers can only mark attendance for their own classes");
  }

  return Attendance.create({
    ...payload,
    markedBy: currentUser._id,
  });
};

export const getAttendanceByClass = async (classId) =>
  Attendance.find({ class: classId })
    .populate({
      path: "student",
      populate: { path: "userId", select: "-password" },
    })
    .populate("class")
    .populate("markedBy", "-password")
    .sort({ date: -1 });

export const getAttendance = async () =>
  Attendance.find()
    .populate({
      path: "student",
      populate: { path: "userId", select: "-password" },
    })
    .populate("class")
    .populate("markedBy", "-password")
    .sort({ date: -1 });

export const updateAttendance = async (id, payload, currentUser) => {
  const attendance = await Attendance.findById(id).populate({
    path: "class",
    populate: {
      path: "teacher",
      populate: { path: "userId", select: "-password" },
    },
  });

  if (!attendance) {
    throw notFound("Attendance record not found");
  }

  if (
    currentUser.role === "teacher" &&
    String(attendance.class.teacher.userId._id) !== String(currentUser._id)
  ) {
    throw badRequest("Teachers can only update attendance for their own classes");
  }

  ["student", "class", "date", "status"].forEach((field) => {
    if (payload[field] !== undefined) {
      attendance[field] = payload[field];
    }
  });

  attendance.markedBy = currentUser._id;
  await attendance.save();
  return attendance;
};

export const deleteAttendance = async (id, currentUser) => {
  const attendance = await Attendance.findById(id).populate({
    path: "class",
    populate: {
      path: "teacher",
      populate: { path: "userId", select: "-password" },
    },
  });

  if (!attendance) {
    throw notFound("Attendance record not found");
  }

  if (
    currentUser.role === "teacher" &&
    String(attendance.class.teacher.userId._id) !== String(currentUser._id)
  ) {
    throw badRequest("Teachers can only delete attendance for their own classes");
  }

  await Attendance.findByIdAndDelete(id);
  return { id };
};
