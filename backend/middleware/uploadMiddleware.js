import fs from "fs";
import path from "path";
import multer from "multer";

import { env } from "../config/env.js";

const uploadsDir = path.resolve("uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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
