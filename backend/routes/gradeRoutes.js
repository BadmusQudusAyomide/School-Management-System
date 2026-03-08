import { Router } from "express";
import { body } from "express-validator";

import { addGrade, editGrade, listGrades, listGradesByStudent, removeGrade } from "../controllers/gradeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

router.use(authMiddleware);

router.get("/", authorizeRoles("admin", "teacher"), listGrades);
router.post(
  "/",
  authorizeRoles("admin", "teacher"),
  [
    body("student").isMongoId().withMessage("Valid student id is required"),
    body("subject").trim().notEmpty().withMessage("Subject is required"),
    body("exam").isMongoId().withMessage("Valid exam id is required"),
    body("score").isFloat({ min: 0, max: 100 }).withMessage("Score must be between 0 and 100"),
    body("grade").trim().notEmpty().withMessage("Grade is required"),
  ],
  validateRequest,
  addGrade
);
router.get("/student/:id", authorizeRoles("admin", "teacher", "student", "parent"), listGradesByStudent);
router.put(
  "/:id",
  authorizeRoles("admin", "teacher"),
  [
    body("student").optional().isMongoId().withMessage("Valid student id is required"),
    body("exam").optional().isMongoId().withMessage("Valid exam id is required"),
    body("score").optional().isFloat({ min: 0, max: 100 }).withMessage("Score must be between 0 and 100"),
  ],
  validateRequest,
  editGrade
);
router.delete("/:id", authorizeRoles("admin", "teacher"), removeGrade);

export default router;
