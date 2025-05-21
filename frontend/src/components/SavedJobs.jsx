import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSavedJobs } from "../redux/authSlice";
import { USER_API_END_POINT } from "../utils/constant.js";
import JobCards from "../components/JobCards.jsx";
import Navbar from "../components/shared/Navbar.jsx";

const SavedJobs = () => {
  const dispatch = useDispatch();
  const savedJobs = useSelector((state) => state.auth.savedJobs);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/saved-jobs`, {
          withCredentials: true,
        });
        dispatch(setSavedJobs(res.data.savedJobs));
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    };
    fetchSavedJobs();
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <div className="p-4">
        {savedJobs && savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedJobs.map((job) => (
              <JobCards key={job._id} job={job} hideSaveButton />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No saved jobs found.</p>
        )}
      </div>
    </>
  );
};

export default SavedJobs;
