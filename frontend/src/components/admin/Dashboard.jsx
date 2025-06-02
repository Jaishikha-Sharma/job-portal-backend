import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, BarChart2, Calendar } from "lucide-react";
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
        Math.max(
          ...allAdminJobs.map((job) => new Date(job.createdAt).getTime())
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
      icon: <Users className="text-green-500 w-6 h-6" />,
    },
    {
      label: "Avg Applicants / Job",
      value: avgApplicants,
      icon: <BarChart2 className="text-blue-500 w-6 h-6" />,
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
      <div className="flex flex-col sm:flex-row max-w-7xl mx-auto min-h-[calc(100vh-64px)] p-4 sm:p-6 gap-6 sm:gap-10">
        {/* Sidebar with vertical stats */}
        <aside className="w-full sm:w-56 bg-white rounded-lg shadow-md p-5 flex flex-row sm:flex-col space-x-4 sm:space-x-0 space-y-0 sm:space-y-8 sticky top-0 sm:top-6 h-fit overflow-x-auto sm:overflow-visible">
          {stats.map(({ label, value, icon }) => (
            <div
              key={label}
              className="flex items-center space-x-3 sm:space-x-4 min-w-[120px] sm:min-w-auto"
            >
              <div className="p-3 bg-gray-100 rounded-md">{icon}</div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col space-y-8 sm:space-y-10">
          {/* Welcome Header */}
          <header className="mb-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">
              Hello,{" "}
              <span className="text-orange-500">
                {user?.fullname || "Recruiter"}
              </span>
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Keep track of your posted jobs and applicants from one place.
            </p>
          </header>

          {/* Summary card */}
          <section className="bg-white rounded-lg shadow-md p-6 sm:p-8 flex flex-col sm:flex-row justify-around items-center gap-6 sm:gap-0">
            <div
              onClick={() => navigate("/admin/jobs")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate("/admin/jobs");
                }
              }}
              className="cursor-pointer"
            >
              <div className="text-center">
                <p className="text-4xl sm:text-5xl font-bold text-orange-500">
                  {jobsPosted}
                </p>
                <p className="text-gray-600 font-medium">Jobs Posted</p>
              </div>
            </div>

            <div className="text-center border-t sm:border-t-0 sm:border-l sm:border-r border-gray-200 px-0 sm:px-8 py-4 sm:py-0">
              <p className="text-4xl sm:text-5xl font-bold text-green-500">
                {totalApplicants}
              </p>
              <p className="text-gray-600 font-medium">Total Applicants</p>
            </div>
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-blue-500">
                {avgApplicants}
              </p>
              <p className="text-gray-600 font-medium">Avg Applicants / Job</p>
            </div>
          </section>

          {/* Bottom controls */}
          <section className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <button
              onClick={() => navigate("/admin/jobs/create")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-7 rounded-md shadow-md transition w-full sm:w-auto text-center"
            >
              Post New Job
            </button>

            {/* Optional: Recent jobs list */}
            <div className="text-gray-700 italic text-sm">
              Showing latest {Math.min(allAdminJobs.length, 3)} jobs
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
