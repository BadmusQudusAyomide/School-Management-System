import { Router } from "express";
import { body } from "express-validator";

import {
  addStudent,
  editStudent,
  getStudent,
  listStudents,
  removeStudent,
} from "../controllers/studentController.js";
import { uploadDocuments } from "../controllers/uploadController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { studentDocumentUpload } from "../middleware/uploadMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

router.use(authMiddleware);

router.get("/", authorizeRoles("admin", "teacher", "accountant"), listStudents);
router.get("/:id", authorizeRoles("admin", "teacher", "student", "parent"), getStudent);
router.post(
  "/",
  authorizeRoles("admin"),
  [
    body("userId").isMongoId().withMessage("Valid userId is required"),
    body("admissionNumber").trim().notEmpty().withMessage("Admission number is required"),
    body("class").isMongoId().withMessage("Valid class id is required"),
    body("section").trim().notEmpty().withMessage("Section is required"),
    body("dateOfBirth").isISO8601().withMessage("Valid dateOfBirth is required"),
    body("gender").isIn(["male", "female", "other"]).withMessage("Invalid gender"),
    body("parentId").isMongoId().withMessage("Valid parentId is required"),
    body("address").trim().notEmpty().withMessage("Address is required"),
    body("feesStatus")
      .optional()
      .isIn(["paid", "pending", "partial", "overdue"])
      .withMessage("Invalid feesStatus"),
  ],
  validateRequest,
  addStudent
);
router.put(
  "/:id",
  authorizeRoles("admin"),
  [
    body("userId").optional().isMongoId().withMessage("Valid userId is required"),
    body("class").optional().isMongoId().withMessage("Valid class id is required"),
    body("dateOfBirth").optional().isISO8601().withMessage("Valid dateOfBirth is required"),
    body("gender").optional().isIn(["male", "female", "other"]).withMessage("Invalid gender"),
    body("parentId").optional().isMongoId().withMessage("Valid parentId is required"),
    body("feesStatus")
      .optional()
      .isIn(["paid", "pending", "partial", "overdue"])
      .withMessage("Invalid feesStatus"),
  ],
  validateRequest,
  editStudent
);
router.delete("/:id", authorizeRoles("admin"), removeStudent);
router.post(
  "/:id/documents",
  authorizeRoles("admin", "teacher"),
  studentDocumentUpload.array("documents", 10),
  uploadDocuments
);

export default router;
