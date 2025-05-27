import React, { useEffect } from "react";
import axios from "../utils/axiosConfig";
import { useDispatch } from "react-redux";
import { setAllJobs } from "../redux/jobSlice";
import { JOB_API_END_POINT } from "../utils/constant.js";

const useGetAllJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const token = localStorage.getItem("token"); // get token from localStorage
        const res = await axios.get(`${JOB_API_END_POINT}/get`, {
          headers: {
            Authorization: `Bearer ${token}`, // add Authorization header
          },
        });
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllJobs();
  }, [dispatch]);
};

export default useGetAllJobs;
