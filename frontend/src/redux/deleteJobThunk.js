import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/axiosConfig.js";
import { JOB_API_END_POINT } from "../utils/constant.js"

export const deleteJob = createAsyncThunk(
  "job/deleteJob",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const deleteUrl = `${JOB_API_END_POINT}/delete/${id}`;
      await axios.delete(deleteUrl, config);

      // Return deleted job ID to remove from Redux store
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
