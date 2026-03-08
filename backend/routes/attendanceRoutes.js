import { Router } from "express";
import { body } from "express-validator";

import {
  editAttendance,
  listAttendance,
  listAttendanceByClass,
  markAttendance,
  removeAttendance,
} from "../controllers/attendanceController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

router.use(authMiddleware);

router.get("/", authorizeRoles("admin", "teacher"), listAttendance);
router.post(
  "/",
  authorizeRoles("admin", "teacher"),
  [
    body("student").isMongoId().withMessage("Valid student id is required"),
    body("class").isMongoId().withMessage("Valid class id is required"),
    body("date").isISO8601().withMessage("Valid date is required"),
    body("status").isIn(["present", "absent", "late", "excused"]).withMessage("Invalid status"),
  ],
  validateRequest,
  markAttendance
);
router.get("/class/:id", authorizeRoles("admin", "teacher", "student", "parent"), listAttendanceByClass);
router.put(
  "/:id",
  authorizeRoles("admin", "teacher"),
  [
    body("student").optional().isMongoId().withMessage("Valid student id is required"),
    body("class").optional().isMongoId().withMessage("Valid class id is required"),
    body("date").optional().isISO8601().withMessage("Valid date is required"),
    body("status").optional().isIn(["present", "absent", "late", "excused"]).withMessage("Invalid status"),
  ],
  validateRequest,
  editAttendance
);
router.delete("/:id", authorizeRoles("admin", "teacher"), removeAttendance);

export default router;
