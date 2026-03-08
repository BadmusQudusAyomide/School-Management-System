import { Router } from "express";
import { body } from "express-validator";

import { addFee, editFee, listFees, listFeesByStudent, removeFee } from "../controllers/feeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

router.use(authMiddleware);

router.get("/", authorizeRoles("admin", "accountant"), listFees);
router.post(
  "/",
  authorizeRoles("admin", "accountant"),
  [
    body("student").isMongoId().withMessage("Valid student id is required"),
    body("amount").isFloat({ min: 0 }).withMessage("Amount must be at least 0"),
    body("paid").optional().isFloat({ min: 0 }).withMessage("Paid must be at least 0"),
    body("status")
      .optional()
      .isIn(["pending", "partial", "paid", "overdue"])
      .withMessage("Invalid status"),
    body("dueDate").isISO8601().withMessage("Valid dueDate is required"),
  ],
  validateRequest,
  addFee
);
router.get("/student/:id", authorizeRoles("admin", "accountant", "student", "parent"), listFeesByStudent);
router.put(
  "/:id",
  authorizeRoles("admin", "accountant"),
  [
    body("student").optional().isMongoId().withMessage("Valid student id is required"),
    body("amount").optional().isFloat({ min: 0 }).withMessage("Amount must be at least 0"),
    body("paid").optional().isFloat({ min: 0 }).withMessage("Paid must be at least 0"),
    body("status").optional().isIn(["pending", "partial", "paid", "overdue"]).withMessage("Invalid status"),
    body("dueDate").optional().isISO8601().withMessage("Valid dueDate is required"),
  ],
  validateRequest,
  editFee
);
router.delete("/:id", authorizeRoles("admin", "accountant"), removeFee);

export default router;
