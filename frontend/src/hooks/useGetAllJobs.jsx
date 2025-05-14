import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux"; 
import { setAllJobs } from "../redux/jobSlice";
import { JOB_API_END_POINT  } from "../utils/constant.js"; 

const useGetAllJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllJobs(); // ✅ Function is now being called
  }, [dispatch]); // ✅ Correct dependency
};

export default useGetAllJobs;
