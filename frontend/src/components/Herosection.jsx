import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";
import { useNavigate } from "react-router-dom";

const Herosection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-white to-pink-100 px-4 sm:px-6 lg:px-20 py-10">
      {/* Content Layout */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        {/* Left: Text */}
        <div className="w-full md:w-2/3 text-center md:text-left space-y-5">
          <span className="px-4 py-2 rounded-full bg bg-white text-[#f83002] font-medium text-sm sm:text-base inline-block">
            No.1 Job Hunt Website
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug">
            Search, apply & <br />
            Get your <span className="text-[#6a38c2]">Dream Job</span>
          </h1>
          <p className="text-sm sm:text-base max-w-xl text-gray-600 mx-auto md:mx-0">
            Explore top job listings, apply in minutes, and take the next step
            in your career.
          </p>
        </div>

        {/* Right: Image */}
        <div className="w-full md:w-1/3 flex justify-center">
          <img
            src="./img.png"
            alt="Hero"
            className="w-full max-w-xs md:max-w-sm hover:scale-105 transition-transform duration-500 md:block hidden"
          />
        </div>
      </div>

      {/* Search input: always centered below */}
      <div className="flex w-full max-w-xl mx-auto mt-10 shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-2 sm:gap-4 bg-white">
        <input
          className="outline-none border-none w-full py-2 px-2 text-sm sm:text-base rounded-l-full"
          type="text"  onChange={(e) => setQuery(e.target.value)}
          placeholder="Find your dream jobs"
        />
        <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6a38c2] px-4 py-2">
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Herosection;
