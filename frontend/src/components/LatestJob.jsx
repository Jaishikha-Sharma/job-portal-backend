import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";
import useGetAllJobs from "../hooks/useGetAllJobs";
import { Link } from "react-router-dom";

const LatestJobs = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold text-left mb-10">
        <span className="text-[#6A38C2]">Latest & Top </span> Job Openings
      </h1>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allJobs.length <= 0 ? (
          <span className="text-center col-span-full text-gray-500">
            No Job Available
          </span>
        ) : (
          allJobs
            ?.slice(0, 6)
            .map((job) => <LatestJobCards key={job._id} job={job} />)
        )}
      </div>

      {/* See All Jobs Button */}
      <div className="mt-12 text-center">
        <Link
          to="/jobs"
          className="inline-block px-8 py-3 text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-semibold rounded-full shadow-md transition-transform duration-300 transform hover:scale-105"
        >
          🔎 See All Jobs
        </Link>
      </div>
    </div>
  );
};

export default LatestJobs;
