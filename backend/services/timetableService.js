import Timetable from "../models/Timetable.js";
import { notFound } from "../utils/errors.js";

export const getTimetables = async () =>
  Timetable.find()
    .populate({
      path: "class",
      populate: {
        path: "teacher",
        populate: { path: "userId", select: "-password" },
      },
    })
    .populate({
      path: "teacher",
      populate: { path: "userId", select: "-password" },
    })
    .sort({ dayOfWeek: 1, startTime: 1 });

export const createTimetable = async (payload) => Timetable.create(payload);

export const updateTimetable = async (id, payload) => {
  const timetable = await Timetable.findById(id);
  if (!timetable) {
    throw notFound("Timetable entry not found");
  }

  ["class", "subject", "teacher", "dayOfWeek", "startTime", "endTime", "room"].forEach((field) => {
    if (payload[field] !== undefined) {
      timetable[field] = payload[field];
    }
  });

  await timetable.save();
  return timetable;
};

export const deleteTimetable = async (id) => {
  const timetable = await Timetable.findByIdAndDelete(id);
  if (!timetable) {
    throw notFound("Timetable entry not found");
  }

  return { id };
};
