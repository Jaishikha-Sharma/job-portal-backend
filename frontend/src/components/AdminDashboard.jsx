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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${ADMIN_API_END_POINT}/users`, {
      });
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        alert("Failed to fetch users");
      }
    } catch (error) {
      alert("Error fetching users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await axios.delete(
        `${ADMIN_API_END_POINT}/users/${id}`,
        {
        }
      );
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

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading users...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Admin Dashboard
      </h2>
      {users.length === 0 ? (
        <p className="text-center text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 border-b border-gray-300">
                  Fullname
                </th>
                <th className="text-left py-3 px-4 border-b border-gray-300">
                  Email
                </th>
                <th className="text-left py-3 px-4 border-b border-gray-300">
                  Role
                </th>
                <th className="text-center py-3 px-4 border-b border-gray-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map(({ _id, fullname, email, role }) => (
                <tr key={_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b border-gray-200">
                    {fullname}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200">
                    {email}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200">{role}</td>
                  <td className="py-3 px-4 border-b border-gray-200 text-center">
                    <button
                      onClick={() => handleDelete(_id)}
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
    </div>
  );
};

export default AdminDashboard;
