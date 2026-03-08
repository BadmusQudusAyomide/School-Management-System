import Exam from "../models/Exam.js";
import { notFound } from "../utils/errors.js";

export const createExam = async (payload) => Exam.create(payload);

export const getExams = async () =>
  Exam.find()
    .populate("class")
    .sort({ date: -1 });

export const updateExam = async (id, payload) => {
  const exam = await Exam.findById(id);
  if (!exam) {
    throw notFound("Exam not found");
  }

  ["name", "class", "subjects", "date"].forEach((field) => {
    if (payload[field] !== undefined) {
      exam[field] = payload[field];
    }
  });

  await exam.save();
  return exam;
};

export const deleteExam = async (id) => {
  const exam = await Exam.findByIdAndDelete(id);
  if (!exam) {
    throw notFound("Exam not found");
  }

  return { id };
};
