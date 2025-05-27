import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../utils/axiosConfig";
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
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Your Saved Jobs
          </h1>

          {savedJobs && savedJobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.map((job) => (
                <div
                  key={job._id}
                  className="animate-fadeIn transform transition duration-300 hover:scale-[1.02]"
                >
                  <JobCards job={job} hideSaveButton />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-60">
              <p className="text-gray-500 text-lg font-medium">
                You haven't saved any jobs yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SavedJobs;
