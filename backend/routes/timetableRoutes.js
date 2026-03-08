import { Router } from "express";
import { body } from "express-validator";

import { addTimetable, editTimetable, listTimetables, removeTimetable } from "../controllers/timetableController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

router.use(authMiddleware);

router.get("/", authorizeRoles("admin", "teacher", "student"), listTimetables);
router.post(
  "/",
  authorizeRoles("admin", "teacher"),
  [
    body("class").isMongoId().withMessage("Valid class id is required"),
    body("teacher").isMongoId().withMessage("Valid teacher id is required"),
    body("subject").trim().notEmpty().withMessage("Subject is required"),
    body("dayOfWeek").isInt({ min: 0, max: 6 }).withMessage("dayOfWeek must be between 0 and 6"),
    body("startTime").trim().notEmpty().withMessage("Start time is required"),
    body("endTime").trim().notEmpty().withMessage("End time is required"),
  ],
  validateRequest,
  addTimetable
);
router.put(
  "/:id",
  authorizeRoles("admin", "teacher"),
  [
    body("class").optional().isMongoId().withMessage("Valid class id is required"),
    body("teacher").optional().isMongoId().withMessage("Valid teacher id is required"),
    body("dayOfWeek").optional().isInt({ min: 0, max: 6 }).withMessage("dayOfWeek must be between 0 and 6"),
  ],
  validateRequest,
  editTimetable
);
router.delete("/:id", authorizeRoles("admin", "teacher"), removeTimetable);

export default router;
