import React from "react";
import Navbar from "./shared/Navbar";
import JobCards from "./JobCards";

const randomJobs = [1, 2, 3];

const Browse = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">
          Search Results ({randomJobs.length})
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {randomJobs.map((item, index) => (
            <JobCards key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browse;
