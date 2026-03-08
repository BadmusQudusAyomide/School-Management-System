import fs from "fs";
import path from "path";
import multer from "multer";

import { env } from "../config/env.js";

const uploadsDir = path.resolve("uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const ensureDirectory = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const createUploader = ({ folder, allowedMimeTypes }) => {
  const targetDirectory = path.join(uploadsDir, folder);
  ensureDirectory(targetDirectory);

  return multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, targetDirectory);
      },
      filename: (_req, file, cb) => {
        const safeName = file.originalname.replace(/\s+/g, "-").toLowerCase();
        cb(null, `${Date.now()}-${safeName}`);
      },
    }),
    limits: {
      fileSize: env.upload.maxFileSize,
    },
    fileFilter: (_req, file, cb) => {
      if (!allowedMimeTypes.some((type) => file.mimetype.startsWith(type))) {
        cb(new Error("Unsupported file type"));
        return;
      }

      cb(null, true);
    },
  });
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-").toLowerCase();
    cb(null, `${Date.now()}-${safeName}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: env.upload.maxFileSize,
  },
});

export const profilePictureUpload = createUploader({
  folder: "profile-pictures",
  allowedMimeTypes: ["image/"],
});

export const studentDocumentUpload = createUploader({
  folder: "student-documents",
  allowedMimeTypes: ["image/", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
});
