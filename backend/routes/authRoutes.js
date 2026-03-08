import { Router } from "express";
import { body } from "express-validator";

import { adminSignup, login, logout, refresh, register } from "../controllers/authController.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

router.post(
  "/admin-signup",
  [
    body("schoolName").trim().notEmpty().withMessage("School name is required"),
    body("adminFirstName").trim().notEmpty().withMessage("Admin first name is required"),
    body("adminLastName").trim().notEmpty().withMessage("Admin last name is required"),
    body("adminEmail").isEmail().withMessage("Valid admin email is required").normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("schoolAddress").trim().notEmpty().withMessage("School address is required"),
    body("schoolPhone").trim().notEmpty().withMessage("School phone is required"),
    body("timezone").trim().notEmpty().withMessage("Timezone is required"),
    body("currency").trim().notEmpty().withMessage("Currency is required"),
  ],
  validateRequest,
  adminSignup
);

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("schoolId").isMongoId().withMessage("Valid schoolId is required"),
    body("role")
      .optional()
      .isIn(["admin", "teacher", "student", "parent", "accountant"])
      .withMessage("Invalid role"),
    body("phone").optional().trim(),
    body("profilePicture").optional().trim(),
  ],
  validateRequest,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
    body("schoolId").optional().isMongoId().withMessage("schoolId must be a valid MongoDB id"),
  ],
  validateRequest,
  login
);

router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
