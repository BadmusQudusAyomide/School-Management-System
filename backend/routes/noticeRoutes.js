import { Router } from "express";
import { body } from "express-validator";

import { addNotice, editNotice, listNotices, removeNotice } from "../controllers/noticeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  authorizeRoles("admin", "teacher"),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("targetRole")
      .isIn(["admin", "teacher", "student", "parent", "accountant"])
      .withMessage("Invalid targetRole"),
  ],
  validateRequest,
  addNotice
);
router.get("/", listNotices);
router.put(
  "/:id",
  authorizeRoles("admin", "teacher"),
  [
    body("title").optional().trim().notEmpty().withMessage("Title is required"),
    body("description").optional().trim().notEmpty().withMessage("Description is required"),
    body("targetRole")
      .optional()
      .isIn(["admin", "teacher", "student", "parent", "accountant"])
      .withMessage("Invalid targetRole"),
  ],
  validateRequest,
  editNotice
);
router.delete("/:id", authorizeRoles("admin", "teacher"), removeNotice);

export default router;
