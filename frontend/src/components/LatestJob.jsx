import React from "react";
import LatestJobCards from "./LatestJobCards";
const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJob = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-20 py-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
        <span className="text-[#6a38c2]">Latest</span> Job Openings
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
        {randomJobs.slice(0,6).map((item, index) => (
          <LatestJobCards />
        ))}
      </div>
    </div>
  );
};

export default LatestJob;
