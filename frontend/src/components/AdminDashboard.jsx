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
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchUsers();
    fetchCompanies();
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
        setCompanies(response.data.companies);
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

  if (loadingUsers || loadingCompanies)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-md mt-10 space-y-12">
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Users</h2>
        {users.length === 0 ? (
          <p className="text-center text-gray-600">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 border-b border-gray-300">Fullname</th>
                  <th className="text-left py-3 px-4 border-b border-gray-300">Email</th>
                  <th className="text-left py-3 px-4 border-b border-gray-300">Role</th>
                  <th className="text-center py-3 px-4 border-b border-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(({ _id, fullname, email, role }) => (
                  <tr key={_id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-3 px-4 border-b border-gray-200">{fullname}</td>
                    <td className="py-3 px-4 border-b border-gray-200">{email}</td>
                    <td className="py-3 px-4 border-b border-gray-200">{role}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-center">
                      <button
                        onClick={() => handleDeleteUser(_id)}
                        className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md transition-colors duration-200"
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

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Companies</h2>
        {companies.length === 0 ? (
          <p className="text-center text-gray-600">No companies found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 border-b border-gray-300">Company Name</th>
                  <th className="text-left py-3 px-4 border-b border-gray-300 max-w-xs">Company Description</th>
                  <th className="text-left py-3 px-4 border-b border-gray-300">Owner Name</th>
                  <th className="text-left py-3 px-4 border-b border-gray-300">Owner Email</th>
                  <th className="text-center py-3 px-4 border-b border-gray-300">Approval Status</th>
                  <th className="text-center py-3 px-4 border-b border-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(({ _id, name, description, userId, isApproved }) => (
                  <tr key={_id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-3 px-4 border-b border-gray-200 font-semibold text-gray-800">{name}</td>
                    <td className="py-3 px-4 border-b border-gray-200 max-w-xs whitespace-normal break-words text-gray-700">
                      {description || "-"}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200">{userId?.fullname || "-"}</td>
                    <td className="py-3 px-4 border-b border-gray-200">{userId?.email || "-"}</td>
                    <td
                      className={`py-3 px-4 border-b border-gray-200 text-center font-semibold ${
                        isApproved ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isApproved ? "Approved" : "Disapproved"}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 text-center">
                      <button
                        onClick={() => toggleCompanyApproval(_id)}
                        className={`inline-block font-semibold py-1 px-3 rounded-md transition-colors duration-200 ${
                          isApproved
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        {isApproved ? "Disapprove" : "Approve"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
