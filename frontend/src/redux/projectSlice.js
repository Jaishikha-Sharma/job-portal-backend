import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/axiosConfig";
import { PROJECT_API_END_POINT } from "../utils/constant.js";

// Get all projects
export const getAllProjects = createAsyncThunk(
  "project/getAllProjects",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${PROJECT_API_END_POINT}/all`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Create a project
export const createProject = createAsyncThunk(
  "project/createProject",
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post(`${PROJECT_API_END_POINT}/create`, formData);
      console.log("🧪 FULL RESPONSE FROM SERVER >>>", res);
      return res.data.project;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to create project"
      );
    }
  }
);

// 🔥 Delete a project
export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (projectId, thunkAPI) => {
    try {
      await axios.delete(`${PROJECT_API_END_POINT}/${projectId}`);
      return projectId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to delete project"
      );
    }
  }
);

// Initial State
const initialState = {
  allProjects: [],
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    },
    clearProjectLoading: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.allProjects = action.payload;
      })
      .addCase(getAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.allProjects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Delete Project Cases
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.allProjects = state.allProjects.filter(
          (project) => project._id !== action.payload
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProjectError, clearProjectLoading } = projectSlice.actions;

export default projectSlice.reducer;
