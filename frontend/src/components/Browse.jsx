import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import JobCards from "./JobCards";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";
import useGetAllJobs from "../hooks/useGetAllJobs";

const Browse = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Showing {allJobs.length} {allJobs.length === 1 ? "result" : "results"}
        </h1>

        {allJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {allJobs.map((job) => (
              <JobCards key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">No jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default Browse;
