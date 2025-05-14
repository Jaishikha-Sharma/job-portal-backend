import React from "react";
import { Badge } from "./ui/badge";

const LatestJobCards = ({ job }) => {
  return (
    <div className="p-4 sm:p-6 rounded-2xl shadow-sm bg-white border border-gray-200 transition-all hover:shadow-md hover:scale-[1.01] duration-300 ease-in-out flex flex-col gap-4">
      
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
