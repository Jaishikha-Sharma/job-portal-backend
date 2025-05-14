import React from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const JobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="p-5 border rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white w-full max-w-full sm:max-w-md mx-auto">
      {/* Time & Save Button */}
      <div className="flex justify-between items-center mb-4 text-gray-400 text-xs">
        <p>2 days ago</p>
        <Button variant="outline" className="rounded-full" size="icon" aria-label="Save job">
          <Bookmark className="w-4 h-4" />
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="ghost" className="p-0" aria-label="Company profile">
          <Avatar className="w-12 h-12 sm:w-10 sm:h-10">
            <AvatarImage
              src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
              alt="Company Logo"
            />
            <AvatarFallback>CL</AvatarFallback>
          </Avatar>
        </Button>
        <div className="text-center sm:text-left">
          <h1 className="text-base sm:text-lg font-semibold text-gray-800">
            {job?.company?.name || "Company Name"}
          </h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>

      {/* Job Title & Description */}
      <div className="mt-4">
        <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-1">
          {job?.title || "Job Title"}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-2">
          {job?.description || "Brief job description goes here. Keep it short and readable."}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge variant="ghost" className="text-blue-600 font-medium text-xs sm:text-sm">
          {job?.position || "12 Positions"}
        </Badge>
        <Badge variant="ghost" className="text-[#f83002] font-medium text-xs sm:text-sm">
          {job?.jobType || "Part Time"}
        </Badge>
        <Badge variant="ghost" className="text-[#6a38c2] font-medium text-xs sm:text-sm">
          {job?.salary || "24 LPA"}
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 mt-5">
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => navigate(`/description/${job?._id}`)}
        >
          Details
        </Button>
        <Button className="bg-[#6a38c2] text-white w-full sm:w-auto hover:bg-[#5c2fbf]">
          Save for later
        </Button>
      </div>
    </div>
  );
};

export default JobCards;
