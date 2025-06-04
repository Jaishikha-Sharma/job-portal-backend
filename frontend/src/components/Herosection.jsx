import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";
import { useNavigate } from "react-router-dom";

const Herosection = () => {
  const [query, setQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // Access allJobs safely from redux store
  const jobs = useSelector((state) => state.job?.allJobs || []);

  useEffect(() => {
    if (query.length === 0) {
      setFilteredJobs([]);
      return;
    }
    const matches = jobs
      .filter((job) => job.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);

    if (matches.length === 0) {
      setFilteredJobs([
        { _id: "no-match", title: "No jobs available at this moment" },
      ]);
    } else {
      setFilteredJobs(matches);
    }
  }, [query, jobs]);

  const searchJobHandler = (searchTerm) => {
    if (searchTerm === "No jobs available at this moment") return;
    dispatch(setSearchedQuery(searchTerm || query));
    setFilteredJobs([]);
    navigate("/browse");
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFilteredJobs([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return ( 
    <div className="bg-gradient-to-br from-indigo-100 via-white to-pink-100 px-4 sm:px-6 lg:px-20 py-10">
      {/* Content Layout */}
      <div className="flex flex-row items-center justify-between gap-6 flex-wrap md:flex-nowrap">
        {/* Left: Text */}
        <div className="w-full md:w-2/3 text-center md:text-left space-y-6">
          <span className="px-5 py-2 rounded-full bg-white text-[#f83002] font-semibold text-sm shadow-md inline-block">
            🚀 No.1 Job Hunt Website
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug">
            Search, apply & <br />
            Get your <span className="text-[#6a38c2]">Dream Job</span>
          </h1>
          <p className="text-sm sm:text-base max-w-xl text-gray-600 mx-auto sm:mx-0">
            Explore top job listings, apply in minutes, and take the next step
            in your career.
          </p>
        </div>

        {/* Right: Image */}
        <div className="w-full sm:w-1/3 flex justify-center">
          <img
            src="./img.png"
            alt="Hero"
            className="w-full max-w-xs sm:max-w-sm hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Search input with dropdown */}
      <div
        className="relative w-full max-w-xl mx-auto mt-10 shadow-xl border border-gray-200 rounded-full bg-white transition-all duration-300"
        ref={dropdownRef}
      >
        <div className="flex items-center gap-2 px-4 py-2">
          <input
            className="flex-1 outline-none bg-transparent text-sm sm:text-base placeholder-gray-500"
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            placeholder=" Find your dream job..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchJobHandler();
              }
            }}
          />
          <Button
            onClick={() => searchJobHandler()}
            className="rounded-full bg-gradient-to-r from-[#6a38c2] to-[#a074f3] text-white px-4 py-2 hover:scale-105 transition-transform duration-200"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Dropdown suggestions */}
        {filteredJobs.length > 0 && (
          <ul className="absolute top-full left-0 right-0 bg-white border border-t-0 border-gray-300 rounded-b-xl max-h-60 overflow-y-auto z-50 shadow-2xl animate-fadeIn scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
            {filteredJobs.map((job) => (
              <li
                key={job._id}
                className={`px-5 py-3 font-medium transition duration-200 select-none
            ${
              job._id === "no-match"
                ? "text-gray-400 cursor-default hover:bg-white"
                : "cursor-pointer hover:bg-indigo-100 hover:text-indigo-900"
            }
          `}
                onClick={() => searchJobHandler(job.title)}
              >
                {job.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Herosection;
