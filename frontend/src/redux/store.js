import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../redux/authSlice.js";
import jobSlice from "../redux/jobSlice.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
    job : jobSlice
  },
});
export default store;
