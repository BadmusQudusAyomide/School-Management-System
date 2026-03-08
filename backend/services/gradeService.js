import Grade from "../models/Grade.js";
import { notFound } from "../utils/errors.js";

export const createGrade = async (payload) => Grade.create(payload);

export const getGradesByStudent = async (studentId) =>
  Grade.find({ student: studentId })
    .populate({
      path: "student",
      populate: { path: "userId", select: "-password" },
    })
    .populate("exam")
    .sort({ createdAt: -1 });

export const getGrades = async () =>
  Grade.find()
    .populate({
      path: "student",
      populate: { path: "userId", select: "-password" },
    })
    .populate("exam")
    .sort({ createdAt: -1 });

export const updateGrade = async (id, payload) => {
  const gradeRecord = await Grade.findById(id);
  if (!gradeRecord) {
    throw notFound("Grade not found");
  }

  ["student", "subject", "exam", "score", "grade"].forEach((field) => {
    if (payload[field] !== undefined) {
      gradeRecord[field] = payload[field];
    }
  });

  await gradeRecord.save();
  return gradeRecord;
};

export const deleteGrade = async (id) => {
  const gradeRecord = await Grade.findByIdAndDelete(id);
  if (!gradeRecord) {
    throw notFound("Grade not found");
  }

  return { id };
};
