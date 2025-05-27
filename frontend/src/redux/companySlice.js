import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { COMPANY_API_END_POINT } from "../utils/constant.js";

export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token"); // Get JWT token from localStorage
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Add token in Authorization header
        },
      };

      const deleteUrl = `${COMPANY_API_END_POINT}/delete/${id}`;
      await axios.delete(deleteUrl, config);

      const getUrl = `${COMPANY_API_END_POINT}/get`;
      const response = await axios.get(getUrl, config);

      return response.data.companies;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    singleCompany: null,
    companies: [],
    searchCompanyByText: "",
    error: null,
    loading: false,
  },
  reducers: {
    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload;
    },
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
    setSearchCompanyByText: (state, action) => {
      state.searchCompanyByText = action.payload;
    },
    clearCompanies: (state) => {
      state.companies = [];
      state.searchCompanyByText = "";
      state.singleCompany = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to delete company";
      });
  },
});

export const {
  setSingleCompany,
  setCompanies,
  setSearchCompanyByText,
  clearCompanies,
} = companySlice.actions;

export default companySlice.reducer;
