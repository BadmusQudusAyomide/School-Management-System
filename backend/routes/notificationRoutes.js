import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { listNotifications, readNotification } from "../controllers/notificationController.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listNotifications);
router.put("/:id/read", readNotification);

export default router;
