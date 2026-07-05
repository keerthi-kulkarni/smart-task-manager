import express from "express";
import {
  listNotifications,
  readAllNotifications,
  readNotification,
  removeAllNotifications,
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
router.delete("/", removeAllNotifications);
router.delete("/:id", removeNotification);

export default router;
