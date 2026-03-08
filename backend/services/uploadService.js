import User from "../models/User.js";
import Student from "../models/Student.js";
import { badRequest, forbidden, notFound } from "../utils/errors.js";

const buildPublicPath = (folder, filename) => `/uploads/${folder}/${filename}`;

export const uploadProfilePictureForUser = async (userId, file, currentUser) => {
  if (!file) {
    throw badRequest("Profile picture file is required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw notFound("User not found");
  }

  const isSelf = String(user._id) === String(currentUser._id);
  if (!isSelf && currentUser.role !== "admin") {
    throw forbidden("You do not have permission to update this profile picture");
  }

  user.profilePicture = buildPublicPath("profile-pictures", file.filename);
  await user.save();

  return user;
};

export const uploadStudentDocuments = async (studentId, files, currentUser) => {
  if (!files.length) {
    throw badRequest("At least one student document is required");
  }

  if (!["admin", "teacher"].includes(currentUser.role)) {
    throw forbidden("Only admin and teacher roles can upload student documents");
  }

  const student = await Student.findById(studentId);
  if (!student) {
    throw notFound("Student not found");
  }

  const documents = files.map((file) => ({
    originalName: file.originalname,
    filename: file.filename,
    path: buildPublicPath("student-documents", file.filename),
    mimeType: file.mimetype,
    size: file.size,
  }));

  student.documents.push(...documents);
  await student.save();

  return student;
};
