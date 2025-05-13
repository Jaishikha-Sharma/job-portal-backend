import React from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

const JobCards = () => {
  return (
    <div className="p-4 border rounded-md shadow-md bg-white max-w-full sm:max-w-md mx-auto">
      <div className="flex justify-between items-start mb-3">
        <p className="text-xs sm:text-sm text-gray-500">2 days ago</p>
        <Button
          variant="outline"
          className="rounded-full"
          size="icon"
          aria-label="Save job"
        >
          <Bookmark className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
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
          <h1 className="text-base sm:text-lg font-medium">Company name</h1>
          <p className="text-sm text-gray-600">India</p>
        </div>
      </div>

      <div className="mt-3">
        <h1 className="text-sm sm:text-base font-bold my-2">Title</h1>
        <p className="text-sm text-gray-600">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque
          consequuntur dolor beatae repellendus veritatis blanditiis amet odit
          magni nisi iure?
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-3">
        <Badge variant="ghost" className="text-blue-600 font-semibold text-xs sm:text-sm">
          12 Positions
        </Badge>
        <Badge variant="ghost" className="text-[#f83002] font-semibold text-xs sm:text-sm">
          Part Time
        </Badge>
        <Badge variant="ghost" className="text-[#6a38c2] font-semibold text-xs sm:text-sm">
          24 LPA
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <Button variant="outline" className="w-full sm:w-auto">Details</Button>
        <Button className="bg-[#6a38c2] text-white w-full sm:w-auto">Save for later</Button>
      </div>
    </div>
  );
};

export default JobCards;
