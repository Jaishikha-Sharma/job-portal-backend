import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name:'application',
    initialState:{
        applicants:null,
         projectApplicants: null,
    },
    reducers:{
        setAllApplicants:(state,action) => {
            state.applicants = action.payload;
        },
        setProjectApplicants: (state, action) => {
      state.projectApplicants = action.payload;
    },
    }
});
export const {setAllApplicants , setProjectApplicants } = applicationSlice.actions;
export default applicationSlice.reducer;