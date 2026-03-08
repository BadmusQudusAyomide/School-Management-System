import Report from "../models/Report.js";
import { notFound } from "../utils/errors.js";

export const getReports = async () =>
  Report.find().populate("createdBy", "-password").sort({ createdAt: -1 });

export const createReport = async (payload, currentUser) =>
  Report.create({
    ...payload,
    createdBy: currentUser._id,
  });

export const updateReport = async (id, payload) => {
  const report = await Report.findById(id);
  if (!report) {
    throw notFound("Report not found");
  }

  ["title", "type", "period", "summary"].forEach((field) => {
    if (payload[field] !== undefined) {
      report[field] = payload[field];
    }
  });

  await report.save();
  return report;
};

export const deleteReport = async (id) => {
  const report = await Report.findByIdAndDelete(id);
  if (!report) {
    throw notFound("Report not found");
  }

  return { id };
};
