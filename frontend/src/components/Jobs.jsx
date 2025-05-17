import React, { useState, useEffect } from "react";
import Navbar from "../components/shared/Navbar";
import FilterCard from "./FilterCard";
import JobCards from "../components/JobCards";
import useGetAllJobs from "../hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Jobs = () => {
  useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector((store) => store.job);

  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    if (searchedQuery && typeof searchedQuery === "object") {
      const filteredJobs = allJobs.filter((job) => {
        const matchLocation =
          !searchedQuery.Location ||
          job.location
            .toLowerCase()
            .includes(searchedQuery.Location.toLowerCase());

        const matchIndustry =
          !searchedQuery.Industry ||
          job.title
            .toLowerCase()
            .includes(searchedQuery.Industry.toLowerCase());

        const matchSalary =
          !searchedQuery.Salary ||
          (job.salary &&
            job.salary
              .toString()
              .toLowerCase()
              .includes(searchedQuery.Salary.toLowerCase()));

        return matchLocation && matchIndustry && matchSalary;
      });

      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Mobile Filter */}
        <div className="block sm:hidden mb-5">
          <FilterCard isMobile />
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filter */}
          <div className="hidden sm:block sm:w-1/4">
            <FilterCard />
          </div>

          {/* Job Cards Grid */}
          <div className="flex-1">
            {filterJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterJobs.map((job) => (
                  <motion.div
                    key={job?._id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <JobCards job={job} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-8">
                No jobs found matching the filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
