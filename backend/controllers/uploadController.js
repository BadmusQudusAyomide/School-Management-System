import asyncHandler from "../utils/asyncHandler.js";
import { uploadProfilePictureForUser, uploadStudentDocuments } from "../services/uploadService.js";

export const uploadProfilePicture = asyncHandler(async (req, res) => {
  const user = await uploadProfilePictureForUser(req.params.id, req.file, req.user);
  res.status(200).json({
    success: true,
    message: "Profile picture uploaded successfully",
    data: user,
  });
});

export const uploadDocuments = asyncHandler(async (req, res) => {
  const student = await uploadStudentDocuments(req.params.id, req.files ?? [], req.user);
  res.status(200).json({
    success: true,
    message: "Student documents uploaded successfully",
    data: student,
  });
});
