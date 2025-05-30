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
        if (searchedQuery.Location && job.location !== searchedQuery.Location) return false;
        if (searchedQuery.Industry && job.title !== searchedQuery.Industry) return false;
        if (searchedQuery.Salary && job.salary?.toString() !== searchedQuery.Salary) return false;
        if (searchedQuery["Experience Level"] && job.experienceLevel !== searchedQuery["Experience Level"]) return false;
        if (searchedQuery["Job Type"] && job.jobType !== searchedQuery["Job Type"]) return false;
        if (searchedQuery.Qualification && job.qualification !== searchedQuery.Qualification) return false;
        if (searchedQuery["Gender Preference"] && job.genderPreference !== searchedQuery["Gender Preference"]) return false;
        if (
          searchedQuery["Languages Known"] &&
          (!job.languagesKnown || !job.languagesKnown.includes(searchedQuery["Languages Known"]))
        )
          return false;

        return true;
      });

      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Mobile Filter */}
        <div className="block sm:hidden mb-6">
          <FilterCard isMobile jobs={allJobs} />
        </div>

        <div className="flex flex-col sm:flex-row gap-8">
          {/* Sidebar Filter */}
          <div className="hidden sm:block sm:w-1/4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Filters</h2>
            <FilterCard jobs={allJobs} />
          </div>

          {/* Job Cards Grid */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Showing {filterJobs.length} Job{filterJobs.length !== 1 ? "s" : ""}
            </h2>

            {filterJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterJobs.map((job) => (
                  <motion.div
                    key={job._id || job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <JobCards job={job} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-10">
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
