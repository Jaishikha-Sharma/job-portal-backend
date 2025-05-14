import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux"; 
import { JOB_API_END_POINT  } from "../utils/constant.js"; 
import { setSingleJob } from "../redux/authSlice.js";

const useGetSingleJob = (jobId) => {
  const dispatch = useDispatch();


};

export default useGetSingleJob;
