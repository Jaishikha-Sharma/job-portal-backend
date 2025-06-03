import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  BarChart2,
  Calendar,
  PlusCircle,
} from "lucide-react";
import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs";
import Navbar from "../shared/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const allAdminJobs = useSelector((state) => state.job.allAdminJobs);

  useGetAllAdminJobs();

  const jobsPosted = allAdminJobs?.length || 0;
  const totalApplicants = allAdminJobs?.reduce(
    (acc, job) => acc + (job.applications?.length || 0),
    0
  );
  const avgApplicants = jobsPosted
    ? (totalApplicants / jobsPosted).toFixed(1)
    : 0;
  const lastPostedJobDate = jobsPosted
    ? new Date(
        Math.max(...allAdminJobs.map((job) => new Date(job.createdAt).getTime()))
      ).toLocaleDateString()
    : "N/A";

  const stats = [
    {
      label: "Jobs Posted",
      value: jobsPosted,
      icon: <Briefcase className="w-6 h-6 text-orange-500" />,
      bg: "bg-orange-50",
    },
    {
      label: "Total Applicants",
      value: totalApplicants,
      icon: <Users className="w-6 h-6 text-green-500" />,
      bg: "bg-green-50",
    },
    {
      label: "Avg Applicants / Job",
      value: avgApplicants,
      icon: <BarChart2 className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      label: "Last Job Posted",
      value: lastPostedJobDate,
      icon: <Calendar className="w-6 h-6 text-red-500" />,
      bg: "bg-red-50",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, <span className="text-orange-500">{user?.fullname || "Recruiter"}</span>
          </h1>
          <p className="text-gray-600 mt-1">Your personalized hiring dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map(({ label, value, icon, bg }) => (
            <div
              key={label}
              className={`p-5 ${bg} rounded-xl shadow-sm border hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between mb-2">
                {icon}
              </div>
              <p className="text-2xl font-semibold text-gray-800">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Actions & Summary */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <button
            onClick={() => navigate("/admin/jobs/create")}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-md shadow transition"
          >
            <PlusCircle className="w-5 h-5" />
            Post a New Job
          </button>

          <div className="text-sm text-gray-500 italic">
            Showing latest {Math.min(allAdminJobs.length, 3)} job postings
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
