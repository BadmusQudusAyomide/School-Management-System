import { Router } from "express";
import { body } from "express-validator";

import { addSetting, editSetting, listSettings, removeSetting } from "../controllers/settingController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

router.use(authMiddleware, adminOnly);

router.get("/", listSettings);
router.post(
  "/",
  [
    body("key").trim().notEmpty().withMessage("Key is required"),
    body("value").trim().notEmpty().withMessage("Value is required"),
  ],
  validateRequest,
  addSetting
);
router.put("/:id", validateRequest, editSetting);
router.delete("/:id", removeSetting);

export default router;
