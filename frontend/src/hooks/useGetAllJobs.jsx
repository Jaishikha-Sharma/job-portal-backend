import { useEffect } from "react";
import axios from "../utils/axiosConfig";
import { useDispatch } from "react-redux";
import { setAllJobs } from "../redux/jobSlice";
import { JOB_API_END_POINT } from "../utils/constant.js";

const useGetAllJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get`); 

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error(
          "Failed to fetch jobs:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchAllJobs();
  }, [dispatch]);
};

export default useGetAllJobs;
