import { Router } from "express";
import { body } from "express-validator";

import { addUser, editUser, listUsers, removeUser } from "../controllers/userController.js";
import { uploadProfilePicture } from "../controllers/uploadController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";
import { profilePictureUpload } from "../middleware/uploadMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

router.use(authMiddleware);

router.post("/:id/profile-picture", profilePictureUpload.single("profilePicture"), uploadProfilePicture);

router.use(adminOnly);

router.get("/", listUsers);
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("role")
      .isIn(["admin", "teacher", "student", "parent", "accountant"])
      .withMessage("Invalid role"),
  ],
  validateRequest,
  addUser
);
router.put(
  "/:id",
  [
    body("email").optional().isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").optional().isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("role")
      .optional()
      .isIn(["admin", "teacher", "student", "parent", "accountant"])
      .withMessage("Invalid role"),
  ],
  validateRequest,
  editUser
);
router.delete("/:id", removeUser);

export default router;
