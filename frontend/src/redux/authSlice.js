import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage if exists
const savedUser = localStorage.getItem("user");
const initialUser = savedUser ? JSON.parse(savedUser) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: initialUser,
    savedJobs: [],
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setSavedJobs: (state, action) => {
      state.savedJobs = action.payload;
    },
    addSavedJob: (state, action) => {
      state.savedJobs.push(action.payload);
    },
    removeSavedJob: (state, action) => {
      state.savedJobs = state.savedJobs.filter(
        (job) => job._id !== action.payload
      );
    },
    logout: (state) => {
      state.user = null;
      state.savedJobs = [];
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // Also remove token if you save it
    },
  },
});

export const {
  setLoading,
  setUser,
  setSavedJobs,
  addSavedJob,
  removeSavedJob,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
