import React, { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setSavedJobs } from "../redux/authSlice";
import { USER_API_END_POINT } from "../utils/constant.js";
import { Bookmark, BookmarkCheck } from "lucide-react";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const savedJobsFromRedux = useSelector((state) => state.auth.savedJobs);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // ✅ Truncate description to 20 words
  const truncateWords = (text, wordLimit = 20) => {
    const words = text?.split(" ") || [];
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  useEffect(() => {
    if (savedJobsFromRedux && Array.isArray(savedJobsFromRedux)) {
      localStorage.setItem("savedJobs", JSON.stringify(savedJobsFromRedux));
    }
  }, [savedJobsFromRedux]);

  useEffect(() => {
    const savedJobsLocal = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setIsSaved(savedJobsLocal.some((savedJob) => savedJob._id === job._id));
  }, [job._id]);

  const handleClick = () => {
    if (job?._id) {
      navigate(`/description/${job._id}`);
      window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ Scroll to top
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
      {/* Save Icon */}
      <button
        onClick={handleSaveJob}
        disabled={loading || isSaved}
        className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-300 shadow-md ${
          isSaved
            ? "bg-green-100 text-green-600 cursor-not-allowed"
            : "bg-gray-100 hover:bg-blue-100 hover:text-blue-600"
        }`}
        title={isSaved ? "Job Saved" : "Save Job"}
      >
        {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
      </button>

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
        <p className="text-sm sm:text-base text-gray-600">
          {truncateWords(
            job?.description ||
              "Brief job description goes here. Keep it short and readable."
          )}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-2">
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
