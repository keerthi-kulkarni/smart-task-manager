import express from "express";
import {
  listNotifications,
  readAllNotifications,
  readNotification,
  removeNotification,
  unreadCount
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", listNotifications);
router.get("/unread-count", unreadCount);
router.patch("/read-all", readAllNotifications);
router.patch("/:id/read", readNotification);
router.delete("/:id", removeNotification);

export default router;
