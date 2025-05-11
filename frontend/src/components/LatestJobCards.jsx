import React from "react";
import { Badge } from "./ui/badge";

const LatestJobCards = ({ job }) => {
  return (
    <div className="p-3 sm:p-4 rounded-lg shadow-md bg-white border border-gray-100 transition hover:shadow-lg hover:scale-[1.01] duration-300">
      {/* Company Info */}
      <div>
        <h2 className="font-semibold text-sm sm:text-base text-gray-800">
          {job?.company || "Company Name"}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          {job?.location || "India"}
        </p>
      </div>

      {/* Job Title */}
      <div className="mt-2 sm:mt-3">
        <h3 className="font-bold text-base sm:text-lg text-black">
          {job?.title || "Job Title"}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
          {job?.description ||
            "Brief job description goes here. Keep it short and readable."}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-3">
        <Badge variant="ghost" className="text-blue-600 font-semibold text-xs sm:text-sm">
          {job?.positions || "12 Positions"}
        </Badge>
        <Badge variant="ghost" className="text-[#f83002] font-semibold text-xs sm:text-sm">
          {job?.type || "Part Time"}
        </Badge>
        <Badge variant="ghost" className="text-[#6a38c2] font-semibold text-xs sm:text-sm">
          {job?.salary || "24 LPA"}
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
