import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const isProduction = window.location.hostname !== "localhost";
const BASE_URL = isProduction
  ? "https://job-portal-backend-2tyj.onrender.com"
  : "http://localhost:8000";
const ADMIN_API_END_POINT = `${BASE_URL}/admin`;
const btnBase =
  "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 shadow-sm active:scale-95";
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
  // downloadables CSV
  const exportCSV = (data, fileName) => {
    const keys = Object.keys(data[0] || {});

    const csv = [
      keys.join(","),
      ...data.map((row) =>
        keys.map((k) => JSON.stringify(row[k] ?? "")).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.csv`;
    a.click();
  };
  //EXCEL
  const exportExcel = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };
  //PDF
  const exportPDF = (data, columns, fileName) => {
    const doc = new jsPDF();

    const tableData = data.map((item) =>
      columns.map((col) => item[col] ?? "-"),
    );

    autoTable(doc, {
      head: [columns],
      body: tableData,
    });

    doc.save(`${fileName}.pdf`);
  };
  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const response = await axios.get(`${ADMIN_API_END_POINT}/companies`);
      if (response.data.success) {
        const sortedCompanies = response.data.companies.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
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
        `${ADMIN_API_END_POINT}/companies/${companyId}/toggle-approval`,
      );
      if (response.data.success) {
        setCompanies((prev) =>
          prev.map((c) =>
            c._id === companyId ? { ...c, isApproved: !c.isApproved } : c,
          ),
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
    <div className="max-w-7xl mx-auto p-6 mt-10 space-y-10 bg-gray-50">
      {/* Users Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-blue-500 pl-3">
          Users
        </h2>
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => exportCSV(users, "users")}
            className={`${btnBase} bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md`}
          >
            CSV
          </button>

          <button
            onClick={() => exportExcel(users, "users")}
            className={`${btnBase} bg-green-600 text-white hover:bg-green-700 hover:shadow-md`}
          >
            Excel
          </button>

          <button
            onClick={() =>
              exportPDF(users, ["fullname", "email", "role"], "users")
            }
            className={`${btnBase} bg-red-600 text-white hover:bg-red-700 hover:shadow-md`}
          >
            PDF
          </button>
        </div>
        {users.length === 0 ? (
          <p className="text-center text-gray-600">No users found.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <table className="min-w-full border border-gray-200 rounded-md">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm tracking-wide">
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-blue-500 pl-3">
          Companies
        </h2>
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => exportCSV(companies, "companies")}
            className={`${btnBase} bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md`}
          >
            CSV
          </button>

          <button
            onClick={() => exportExcel(companies, "companies")}
            className={`${btnBase} bg-green-600 text-white hover:bg-green-700 hover:shadow-md`}
          >
            Excel
          </button>

          <button
            onClick={() =>
              exportPDF(
                companies,
                ["name", "description", "isApproved"],
                "companies",
              )
            }
            className={`${btnBase} bg-red-600 text-white hover:bg-red-700 hover:shadow-md`}
          >
            PDF
          </button>
        </div>
        {companies.length === 0 ? (
          <p className="text-center text-gray-600">No companies found.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
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
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Jobs Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-blue-500 pl-3">
          Jobs
        </h2>
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => exportCSV(jobs, "jobs")}
            className={`${btnBase} bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md`}
          >
            CSV
          </button>

          <button
            onClick={() => exportExcel(jobs, "jobs")}
            className={`${btnBase} bg-green-600 text-white hover:bg-green-700 hover:shadow-md`}
          >
            Excel
          </button>

          <button
            onClick={() =>
              exportPDF(jobs, ["title", "location", "salary"], "jobs")
            }
            className={`${btnBase} bg-red-600 text-white hover:bg-red-700 hover:shadow-md`}
          >
            PDF
          </button>
        </div>
        {jobs.length === 0 ? (
          <p className="text-center text-gray-600">No jobs found.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
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
                  ({ _id, title, location, salary, createdAt, company }) => (
                    <tr key={_id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">{title}</td>
                      <td className="py-3 px-4 border-b">
                        {company?.name || "-"}
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
                  ),
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
