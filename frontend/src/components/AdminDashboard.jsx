import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";

const isProduction = window.location.hostname !== "localhost";
const BASE_URL = isProduction
  ? "https://job-portal-backend-2tyj.onrender.com"
  : "http://localhost:8000";
const ADMIN_API_END_POINT = `${BASE_URL}/admin`;

const AdminDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchUsers();
    fetchCompanies();
    fetchJobs();
  }, [user, navigate]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get(`${ADMIN_API_END_POINT}/users`);
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        alert("Failed to fetch users");
      }
    } catch (error) {
      alert("Error fetching users");
      console.error(error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const response = await axios.get(`${ADMIN_API_END_POINT}/companies`);
      if (response.data.success) {
        const sortedCompanies = response.data.companies.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCompanies(sortedCompanies);
      } else {
        alert("Failed to fetch companies");
      }
    } catch (error) {
      alert("Error fetching companies");
      console.error(error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const response = await axios.get(`${ADMIN_API_END_POINT}/all`);
      if (response.data.success) {
        setJobs(response.data.jobs);
      } else {
        alert("Failed to fetch jobs");
      }
    } catch (error) {
      alert("Error fetching jobs");
      console.error(error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await axios.delete(`${ADMIN_API_END_POINT}/users/${id}`);
      if (response.data.success) {
        setUsers(users.filter((u) => u._id !== id));
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      alert("Error deleting user");
      console.error(error);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const response = await axios.delete(`${ADMIN_API_END_POINT}/job/${id}`);
      if (response.data.success) {
        setJobs(jobs.filter((j) => j._id !== id));
      } else {
        alert("Failed to delete job");
      }
    } catch (error) {
      alert("Error deleting job");
      console.error(error);
    }
  };

  const toggleCompanyApproval = async (companyId) => {
    try {
      const response = await axios.put(
        `${ADMIN_API_END_POINT}/companies/${companyId}/toggle-approval`
      );
      if (response.data.success) {
        setCompanies((prev) =>
          prev.map((c) =>
            c._id === companyId ? { ...c, isApproved: !c.isApproved } : c
          )
        );
      } else {
        alert("Failed to toggle approval");
      }
    } catch (error) {
      alert("Error toggling approval");
      console.error(error);
    }
  };

  if (loadingUsers || loadingCompanies || loadingJobs)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-md mt-10 space-y-12">
      {/* Users Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Users</h2>
        {users.length === 0 ? (
          <p className="text-center text-gray-600">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b">Fullname</th>
                  <th className="py-3 px-4 border-b">Email</th>
                  <th className="py-3 px-4 border-b">Role</th>
                  <th className="py-3 px-4 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(({ _id, fullname, email, role }) => (
                  <tr key={_id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{fullname}</td>
                    <td className="py-3 px-4 border-b">{email}</td>
                    <td className="py-3 px-4 border-b">{role}</td>
                    <td className="py-3 px-4 border-b text-center">
                      <button
                        onClick={() => handleDeleteUser(_id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Companies Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Companies</h2>
        {companies.length === 0 ? (
          <p className="text-center text-gray-600">No companies found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b">Company Name</th>
                  <th className="py-3 px-4 border-b">Description</th>
                  <th className="py-3 px-4 border-b">Owner Name</th>
                  <th className="py-3 px-4 border-b">Owner Email</th>
                  <th className="py-3 px-4 border-b text-center">
                    Approval Status
                  </th>
                  <th className="py-3 px-4 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(
                  ({ _id, name, description, userId, isApproved }) => (
                    <tr key={_id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b font-semibold">
                        {name}
                      </td>
                      <td className="py-3 px-4 border-b max-w-xs break-words">
                        {description || "-"}
                      </td>
                      <td className="py-3 px-4 border-b">
                        {userId?.fullname || "-"}
                      </td>
                      <td className="py-3 px-4 border-b">
                        {userId?.email || "-"}
                      </td>
                      <td
                        className={`py-3 px-4 border-b text-center font-semibold ${
                          isApproved ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isApproved ? "Approved" : "Disapproved"}
                      </td>
                      <td className="py-3 px-4 border-b text-center">
                        <button
                          onClick={() => toggleCompanyApproval(_id)}
                          className={`py-1 px-3 rounded-md text-white font-semibold ${
                            isApproved
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {isApproved ? "Disapprove" : "Approve"}
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Jobs Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Jobs</h2>
        {jobs.length === 0 ? (
          <p className="text-center text-gray-600">No jobs found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b">Title</th>
                  <th className="py-3 px-4 border-b">Company</th>
                  <th className="py-3 px-4 border-b">Location</th>
                  <th className="py-3 px-4 border-b">Salary</th>
                  <th className="py-3 px-4 border-b">Posted On</th>
                  <th className="py-3 px-4 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(
                  ({ _id, title, location, salary, createdAt, companyId }) => (
                    <tr key={_id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">{title}</td>
                      <td className="py-3 px-4 border-b">
                        {companyId?.name || "-"}
                      </td>
                      <td className="py-3 px-4 border-b">{location}</td>
                      <td className="py-3 px-4 border-b">₹{salary}</td>
                      <td className="py-3 px-4 border-b">
                        {new Date(createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 border-b text-center">
                        <button
                          onClick={() => handleDeleteJob(_id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
