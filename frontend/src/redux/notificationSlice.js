import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/axiosConfig";
import { NOTIFICATION_API_END_POINT } from "../utils/constant";

// Fetch notifications from backend
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(NOTIFICATION_API_END_POINT);
      return response.data.notifications; // backend: { notifications: [...] }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

// Delete a notification by ID
export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${NOTIFICATION_API_END_POINT}/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete notification"
      );
    }
  }
);

// Mark a notification as read by ID
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, thunkAPI) => {
    try {
      const response = await axios.put(`${NOTIFICATION_API_END_POINT}/${id}/read`);
      return response.data.notification; // backend returns updated notification object
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark notification as read"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearNotifications: (state) => {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.items = state.items.filter((notif) => notif._id !== action.payload);
      })

      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (notif) => notif._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
