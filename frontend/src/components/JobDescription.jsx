import React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const JobDescription = () => {
  const isApplied = true;

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl mb-3">Frontend Developer</h1>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="ghost"
              className="text-blue-600 font-semibold text-xs sm:text-sm"
            >
              12 Positions
            </Badge>
            <Badge
              variant="ghost"
              className="text-red-600 font-semibold text-xs sm:text-sm"
            >
              Part Time
            </Badge>
            <Badge
              variant="ghost"
              className="text-purple-600 font-semibold text-xs sm:text-sm"
            >
              24 LPA
            </Badge>
          </div>
        </div>
        <Button
          disabled={isApplied}
          className={`mt-4 sm:mt-0 w-full sm:w-auto ${
            isApplied
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      {/* Section Divider */}
      <h2 className="text-lg font-semibold border-b pb-2 border-gray-300 mb-4">
        Job Description
      </h2>

      {/* Job Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
        <div>
          <p className="font-semibold">
            Role:
            <span className="ml-2 font-normal text-gray-800">Frontend Developer</span>
          </p>
        </div>
        <div>
          <p className="font-semibold">
            Location:
            <span className="ml-2 font-normal text-gray-800">Remote / Bangalore</span>
          </p>
        </div>
        <div>
          <p className="font-semibold">
            Description:
            <span className="ml-2 font-normal text-gray-800">Build modern UIs using React and Tailwind CSS.</span>
          </p>
        </div>
        <div>
          <p className="font-semibold">
            Experience:
            <span className="ml-2 font-normal text-gray-800">2–4 years</span>
          </p>
        </div>
        <div>
          <p className="font-semibold">
            Salary:
            <span className="ml-2 font-normal text-gray-800">24 LPA</span>
          </p>
        </div>
        <div>
          <p className="font-semibold">
            Total Applicants:
            <span className="ml-2 font-normal text-gray-800">78</span>
          </p>
        </div>
        <div>
          <p className="font-semibold">
            Posted Date:
            <span className="ml-2 font-normal text-gray-800">May 10, 2025</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
