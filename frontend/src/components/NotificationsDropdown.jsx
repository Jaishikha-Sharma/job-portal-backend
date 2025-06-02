import React, { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotifications,
  deleteNotification,
  markNotificationAsRead,
} from "../redux/notificationSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const NotificationsDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items: notifications,
    loading,
    error,
  } = useSelector((state) => state.notifications);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      try {
        await dispatch(markNotificationAsRead(notif._id)).unwrap();
        toast.success("Marked as read");
      } catch {
        toast.error("Failed to mark as read");
      }
    }

    if (notif.jobId) {
      setOpen(false);
      navigate(`/description/${notif.jobId}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteNotification(id)).unwrap();
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n._id);
      for (const id of unreadIds) {
        await dispatch(markNotificationAsRead(id)).unwrap();
      }
      toast.success("All marked as read");
      dispatch(fetchNotifications()); // Optional: refresh entire list after bulk update
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle Notifications"
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-semibold rounded-full px-2 py-[2px] shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-2
            w-[90vw] max-w-xs
            max-h-[70vh] overflow-auto
            rounded-lg bg-white shadow-lg border border-gray-200
            z-50
            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
            sm:w-96 sm:max-h-[400px]
          "
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-purple-600 hover:text-purple-800 focus:outline-none focus:underline"
              title="Mark all as read"
            >
              Mark all as read
            </button>
          </div>

          {loading && (
            <p className="p-6 text-center text-gray-500 italic">Loading...</p>
          )}
          {error && (
            <p className="p-6 text-center text-red-600 font-medium">{error}</p>
          )}

          {!loading && notifications.length === 0 && (
            <p className="p-6 text-center text-gray-500 italic">No notifications</p>
          )}

          <ul>
            {notifications.map((notif) => (
              <li
                key={notif._id}
                className={`flex justify-between items-start gap-3 px-5 py-4 border-b cursor-pointer transition-colors duration-150 ${
                  !notif.read
                    ? "bg-purple-50 hover:bg-purple-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <div
                  onClick={() => handleNotificationClick(notif)}
                  className="flex-1 select-text"
                  title={notif.message}
                >
                  <p className="text-gray-900 text-sm leading-relaxed">{notif.message}</p>
                  <time
                    className="text-xs text-gray-400 mt-1 block"
                    dateTime={notif.createdAt}
                  >
                    {new Date(notif.createdAt).toLocaleString()}
                  </time>
                </div>
                <button
                  onClick={() => handleDelete(notif._id)}
                  className="text-gray-400 hover:text-red-600 transition-colors duration-150 focus:outline-none"
                  aria-label="Delete notification"
                  title="Delete notification"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
