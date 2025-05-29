import React, { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import axios from "../utils/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setSavedJobs } from "../redux/authSlice";
import { USER_API_END_POINT } from "../utils/constant.js";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const savedJobsFromRedux = useSelector((state) => state.auth.savedJobs);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // On mount or savedJobsFromRedux change, update isSaved and also sync with localStorage
  useEffect(() => {
    // Save to localStorage whenever savedJobsFromRedux updates
    if (savedJobsFromRedux && Array.isArray(savedJobsFromRedux)) {
      localStorage.setItem("savedJobs", JSON.stringify(savedJobsFromRedux));
    }
  }, [savedJobsFromRedux]);

  // On mount, load savedJobs from localStorage and check if current job is saved
  useEffect(() => {
    const savedJobsLocal = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setIsSaved(savedJobsLocal.some((savedJob) => savedJob._id === job._id));
  }, [job._id]);

  const handleClick = () => {
    if (job?._id) {
      navigate(`/description/${job._id}`);
    }
  };

  const handleSaveJob = async (e) => {
    e.stopPropagation();
    if (isSaved) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to save jobs.");
        setLoading(false);
        return;
      }

      const res = await axios.put(
        `${USER_API_END_POINT}/save-job/${job._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(setSavedJobs(res.data.savedJobs));
      setIsSaved(true);
      alert("Job saved successfully!");
    } catch (error) {
      console.error("Failed to save job", error);
      alert("Failed to save job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer p-4 sm:p-6 rounded-2xl shadow-sm bg-white border border-gray-200 transition-all hover:shadow-sm hover:scale-[1.005] duration-300 ease-in-out flex flex-col gap-4 relative"
    >
      {/* Save Button top-right */}
      <Button
        className={`absolute top-3 right-3 ${
          isSaved
            ? "bg-gray-400 text-gray-800 cursor-not-allowed"
            : "bg-[#6a38c2] text-white hover:bg-[#5c2fbf]"
        }`}
        onClick={handleSaveJob}
        disabled={loading || isSaved}
        size="sm"
      >
        {loading ? "Saving..." : isSaved ? "Saved" : "Save for later"}
      </Button>

      {/* Company Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="font-semibold text-base sm:text-lg text-gray-900">
            {job?.company?.name || "Company Name"}
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            {job?.location || "India"}
          </p>
        </div>
      </div>

      {/* Job Title */}
      <div>
        <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-1">
          {job?.title || "Job Title"}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
          {job?.description ||
            "Brief job description goes here. Keep it short and readable."}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="ghost"
          className="bg-blue-50 text-blue-600 font-medium text-xs sm:text-sm px-2.5 py-1.5 rounded-full"
        >
          {job?.position || "12 Positions"}
        </Badge>
        <Badge
          variant="ghost"
          className="bg-red-50 text-[#f83002] font-medium text-xs sm:text-sm px-2.5 py-1.5 rounded-full"
        >
          {job?.jobType || "Part Time"}
        </Badge>
        <Badge
          variant="ghost"
          className="bg-purple-50 text-[#6a38c2] font-medium text-xs sm:text-sm px-2.5 py-1.5 rounded-full"
        >
          {job?.salary || "24 LPA"}
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
