import React from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

const Herosection = () => {
  return (
    <div className="text-center px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 my-10">
        <span className="px-4 py-2 rounded-full bg-gray-100 text-[#f83002] font-medium mx-auto text-sm sm:text-base">
          No.1 Job Hunt Website
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug">
          Search, apply & <br />
          Get your <span className="text-[#6a38c2]">Dream Job</span>
        </h1>
        <p className="text-sm sm:text-base max-w-xl mx-auto px-2 text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis omnis
          repudiandae tempora in incidunt!
        </p>
        <div className="flex w-full max-w-xl mx-auto shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-2 sm:gap-4">
          <input
            className="outline-none border-none w-full py-2 px-2 text-sm sm:text-base rounded-l-full"
            type="text"
            placeholder="Find your dream jobs"
          />
          <Button className="rounded-r-full bg-[#6a38c2] px-4 py-2">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Herosection;
