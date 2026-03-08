import { Router } from "express";
import { body } from "express-validator";

import { addTeacher, editTeacher, listTeachers, removeTeacher } from "../controllers/teacherController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

router.use(authMiddleware);

router.get("/", authorizeRoles("admin", "teacher"), listTeachers);
router.post(
  "/",
  authorizeRoles("admin"),
  [
    body("userId").isMongoId().withMessage("Valid userId is required"),
    body("qualification").trim().notEmpty().withMessage("Qualification is required"),
    body("salary").isNumeric().withMessage("Salary must be numeric"),
  ],
  validateRequest,
  addTeacher
);
router.put(
  "/:id",
  authorizeRoles("admin"),
  [
    body("userId").optional().isMongoId().withMessage("Valid userId is required"),
    body("salary").optional().isNumeric().withMessage("Salary must be numeric"),
  ],
  validateRequest,
  editTeacher
);
router.delete("/:id", authorizeRoles("admin"), removeTeacher);

export default router;
