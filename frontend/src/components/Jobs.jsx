import React from "react";
import Navbar from "../components/shared/Navbar";
import FilterCard from "./FilterCard";
import JobCards from "../components/JobCards";
import { useSelector } from "react-redux";
import useGetAllJobs from "../hooks/useGetAllJobs";

const Jobs = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Mobile Filter */}
        <div className="block sm:hidden mb-5">
          <FilterCard isMobile />
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filter */}
          <div className="hidden sm:block sm:w-1/4">
            <FilterCard />
          </div>

          {/* Job Cards */}
          <div className="flex-1">
            {allJobs.length === 0 ? (
              <div className="text-center text-gray-600 mt-10">Job not found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
                {allJobs.map((job) => (
                  <JobCards key={job?._id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
