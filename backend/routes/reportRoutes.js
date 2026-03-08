import { Router } from "express";
import { body } from "express-validator";

import { addReport, editReport, listReports, removeReport } from "../controllers/reportController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

router.use(authMiddleware);

router.get("/", authorizeRoles("admin", "teacher", "accountant"), listReports);
router.post(
  "/",
  authorizeRoles("admin", "teacher", "accountant"),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("type").isIn(["attendance", "finance", "academic", "custom"]).withMessage("Invalid report type"),
  ],
  validateRequest,
  addReport
);
router.put(
  "/:id",
  authorizeRoles("admin", "teacher", "accountant"),
  [
    body("type").optional().isIn(["attendance", "finance", "academic", "custom"]).withMessage("Invalid report type"),
  ],
  validateRequest,
  editReport
);
router.delete("/:id", authorizeRoles("admin", "teacher", "accountant"), removeReport);

export default router;
