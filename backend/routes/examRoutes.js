import { Router } from "express";
import { body } from "express-validator";

import { addExam, editExam, listExams, removeExam } from "../controllers/examController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  authorizeRoles("admin", "teacher"),
  [
    body("name").trim().notEmpty().withMessage("Exam name is required"),
    body("class").isMongoId().withMessage("Valid class id is required"),
    body("subjects").isArray({ min: 1 }).withMessage("Subjects must be a non-empty array"),
    body("date").isISO8601().withMessage("Valid date is required"),
  ],
  validateRequest,
  addExam
);
router.get("/", authorizeRoles("admin", "teacher", "student", "parent"), listExams);
router.put(
  "/:id",
  authorizeRoles("admin", "teacher"),
  [
    body("class").optional().isMongoId().withMessage("Valid class id is required"),
    body("subjects").optional().isArray({ min: 1 }).withMessage("Subjects must be a non-empty array"),
    body("date").optional().isISO8601().withMessage("Valid date is required"),
  ],
  validateRequest,
  editExam
);
router.delete("/:id", authorizeRoles("admin", "teacher"), removeExam);

export default router;
