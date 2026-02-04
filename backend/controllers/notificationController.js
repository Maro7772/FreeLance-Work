import Notification from "../models/Notification.js";

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
      notification.isRead = true;
      await notification.save();
      res.json({ message: "الإشعار مقروء بالفعل" });
    } else {
      res.status(404).json({ message: "الإشعار غير موجود" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
