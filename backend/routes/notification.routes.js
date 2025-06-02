import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getNotifications); // Get all notifications for logged-in user
router.route("/:id/read").put(isAuthenticated, markAsRead); // Mark a specific notification as read
router.route("/:id").delete(isAuthenticated, deleteNotification); // Delete a specific notification

export default router;
