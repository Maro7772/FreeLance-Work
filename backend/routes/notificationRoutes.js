import express from "express";
import {
  getMyNotifications,
  markAsRead
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", getMyNotifications);
router.put("/:id", markAsRead);

export default router;
