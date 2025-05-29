import { createSlice } from "@reduxjs/toolkit";
import { deleteJob } from "./deleteJobThunk";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    searchJobByText: "",
    allAppliedJobs: [],
    searchedQuery: "",
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    clearJobs: (state) => {
      state.allJobs = [];
      state.searchJobByText = "";
      state.singleJob = null;
      state.allAppliedJobs = [];
    },
    clearAdminJobs: (state) => {
      state.allAdminJobs = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteJob.fulfilled, (state, action) => {
      const deletedJobId = action.payload;
      state.allAdminJobs = state.allAdminJobs.filter(
        (job) => job._id !== deletedJobId
      );
    });
  },
});

export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  clearJobs,
  clearAdminJobs,
} = jobSlice.actions;

export default jobSlice.reducer;
