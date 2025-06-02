import { Notification } from "../models/notification.model.js";

// Get notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.id;  // Get user id from token (set in your auth middleware)
    
    // Find notifications ONLY for this user
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Error fetching notifications" });
  }
};



// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id; // from your auth middleware

    // Find the notification for this user
    const notification = await Notification.findOne({ _id: id, userId });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found", success: false });
    }

    notification.read = true;
    await notification.save();

    return res.status(200).json({ notification, success: true }); // Return updated notification
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message, success: false });
  }
};


// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
