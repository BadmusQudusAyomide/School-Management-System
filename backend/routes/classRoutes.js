import { Router } from "express";
import { body } from "express-validator";

import { addClass, editClass, listClasses, removeClass } from "../controllers/classController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

router.use(authMiddleware);

router.get("/", authorizeRoles("admin", "teacher"), listClasses);
router.post(
  "/",
  authorizeRoles("admin"),
  [
    body("name").trim().notEmpty().withMessage("Class name is required"),
    body("section").trim().notEmpty().withMessage("Section is required"),
    body("teacher").isMongoId().withMessage("Valid teacher id is required"),
    body("students").optional().isArray().withMessage("Students must be an array"),
  ],
  validateRequest,
  addClass
);
router.put(
  "/:id",
  authorizeRoles("admin"),
  [
    body("teacher").optional().isMongoId().withMessage("Valid teacher id is required"),
    body("students").optional().isArray().withMessage("Students must be an array"),
  ],
  validateRequest,
  editClass
);
router.delete("/:id", authorizeRoles("admin"), removeClass);

export default router;
