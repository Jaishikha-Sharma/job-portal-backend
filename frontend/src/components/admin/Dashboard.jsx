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

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs";
import Navbar from "../shared/Navbar";

const COLORS = ["#FFA500", "#00C49F", "#0088FE", "#FF8042"];

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

  const pieData = [
    { name: "Jobs Posted", value: jobsPosted },
    { name: "Applicants", value: totalApplicants },
    { name: "Avg Applicants/Job", value: Number(avgApplicants) },
  ];

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6 bg-gray-50 min-h-screen flex flex-col">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome,{" "}
            <span className="text-orange-500">{user?.fullname || "Recruiter"}</span>
          </h1>
          <p className="text-gray-600 mt-1">Your personalized hiring dashboard</p>
        </div>

        {/* Container for Pie chart + Stats */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Pie Chart - full width on mobile, fixed width on desktop */}
          <div className="w-full lg:w-96 h-72 sm:h-80 mx-auto lg:mx-0 order-[-1] lg:order-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  label
                  isAnimationActive={true}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Cards with smaller font on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-6 flex-1">
            {stats.map(({ label, value, icon, bg }) => (
              <div
                key={label}
                className={`p-6 ${bg} rounded-xl shadow-md border hover:shadow-xl transition-all cursor-pointer flex flex-col items-center justify-center`}
                onClick={() => {
                  if (label === "Jobs Posted") navigate("/admin/jobs");
                }}
              >
                <div className="mb-3">{icon}</div>
                <p className="text-xl sm:text-3xl font-semibold text-gray-800">{value}</p>
                <p className="text-xs sm:text-base text-gray-600 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-t border-gray-200">

          <button
            onClick={() => navigate("/admin/jobs/create")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md shadow transition"
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
