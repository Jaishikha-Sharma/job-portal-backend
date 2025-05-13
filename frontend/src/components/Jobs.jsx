import React from "react";
import Navbar from "../components/shared/Navbar";
import FilterCard from "./FilterCard";
import JobCards from "../components/JobCards";

const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        {/* Mobile Filter on top */}
        <div className="block sm:hidden mb-4">
          <FilterCard isMobile />
        </div>

        <div className="flex gap-5">
          {/* Sidebar Filter for larger screens */}
          <div className="hidden sm:block sm:w-1/4">
            <FilterCard />
          </div>

          {/* Job Cards Grid */}
          <div className="flex-1">
            {jobsArray.length === 0 ? (
              <span>JOB NOT FOUND</span>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {jobsArray.map((item, index) => (
                  <JobCards key={index} />
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
