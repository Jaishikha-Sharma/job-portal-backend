import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, BarChart2, Calendar } from "lucide-react";
import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs";
import Navbar from "../shared/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { allAdminJobs } = useSelector((state) => state.job);

  useGetAllAdminJobs();

  const [recruiterJobs, setRecruiterJobs] = useState([]);

  useEffect(() => {
    if (!user || !allAdminJobs) return;
    const filtered = allAdminJobs.filter((job) => job.created_by === user._id);
    setRecruiterJobs(filtered);
  }, [allAdminJobs, user]);

  const jobsPosted = recruiterJobs.length;
  const totalApplicants = recruiterJobs.reduce(
    (acc, job) => acc + (job.applications ? job.applications.length : 0),
    0
  );
  const avgApplicants = jobsPosted
    ? (totalApplicants / jobsPosted).toFixed(1)
    : 0;
  const lastPostedJobDate = recruiterJobs.length
    ? new Date(
        Math.max(
          ...recruiterJobs.map((job) => new Date(job.createdAt).getTime())
        )
      ).toLocaleDateString()
    : "N/A";

  const stats = [
    {
      label: "Jobs Posted",
      value: jobsPosted,
      icon: <Briefcase className="text-orange-500 w-6 h-6" />,
    },
    {
      label: "Total Applicants",
      value: totalApplicants,
      icon: <Users className="text-emerald-600 w-6 h-6" />,
    },
    {
      label: "Avg Applicants / Job",
      value: avgApplicants,
      icon: <BarChart2 className="text-blue-600 w-6 h-6" />,
    },
    {
      label: "Last Job Posted",
      value: lastPostedJobDate,
      icon: <Calendar className="text-red-500 w-6 h-6" />,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-xl mb-10 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">
            Welcome back!
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4">
            {user?.fullname || "Recruiter"}
          </h2>
          <p className="text-sm sm:text-base opacity-90 max-w-2xl leading-relaxed">
            Stay on top of your hiring process. Post jobs, track applicants, and
            grow your team effectively.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12">
          {stats.map(({ label, value, icon }) => (
            <div
              key={label}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-md p-4 sm:p-6 text-center transform transition duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex justify-center mb-2 sm:mb-3">{icon}</div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {value}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center sm:justify-end">
          <button
            onClick={() => navigate("/admin/jobs/create")}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 sm:py-3 px-5 sm:px-7 rounded-full shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Post New Job
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
