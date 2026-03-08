import Counter from "../models/Counter.js";

const buildCounterKey = (schoolId, year) => `student_admission:${schoolId}:${year}`;
const buildEmployeeCounterKey = (schoolId, year) => `teacher_employee:${schoolId}:${year}`;

export const generateAdmissionNumber = async (schoolId) => {
  const year = new Date().getFullYear();
  const counter = await Counter.findOneAndUpdate(
    { key: buildCounterKey(schoolId, year) },
    { $inc: { value: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return `ADM-${year}-${String(counter.value).padStart(4, "0")}`;
};

export const generateEmployeeId = async (schoolId) => {
  const year = new Date().getFullYear();
  const counter = await Counter.findOneAndUpdate(
    { key: buildEmployeeCounterKey(schoolId, year) },
    { $inc: { value: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return `EMP-${year}-${String(counter.value).padStart(4, "0")}`;
};
