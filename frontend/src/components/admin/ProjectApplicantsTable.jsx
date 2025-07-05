import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useSelector } from "react-redux";
import { APPLICATION_API_END_POINT } from "../../utils/constant";
import axios from "axios";
import { toast } from "sonner";

const statusOptions = ["Accepted", "Rejected", "On Hold"];

const ProjectApplicantsTable = () => {
  const { projectApplicants } = useSelector((state) => state.application);
  const [localApplicants, setLocalApplicants] = useState(
    projectApplicants || []
  );

  useEffect(() => {
    setLocalApplicants(projectApplicants || []);
  }, [projectApplicants]);

  const updateStatus = async (status, id) => {
    const confirmUpdate = window.confirm(`Change status to "${status}"?`);
    if (!confirmUpdate) return;

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        toast.success("Status updated.");
        setLocalApplicants((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status } : app))
        );
      }
    } catch (error) {
      toast.error("Update failed.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "On Hold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="mt-4">
      <Table className="w-full border-separate border-spacing-y-2 text-sm">
        <TableCaption className="mb-4 text-base font-semibold text-gray-700">
          Project Applicants Table
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="px-4 py-2">Name</TableHead>
            <TableHead className="px-4 py-2">Email</TableHead>
            <TableHead className="px-4 py-2">Resume</TableHead>
            <TableHead className="px-4 py-2">Status</TableHead>
            <TableHead className="px-4 py-2">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localApplicants.map((app) => (
            <TableRow key={app._id} className="bg-white">
              <TableCell className="px-4 py-2">
                {app?.applicant?.fullname || "N/A"}
              </TableCell>
              <TableCell className="px-4 py-2">
                {app?.applicant?.email || "N/A"}
              </TableCell>
              <TableCell className="px-4 py-2">
                {app?.applicant?.profile?.resume ? (
                  <a
                    href={app.applicant.profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Resume
                  </a>
                ) : (
                  <span className="text-gray-400 italic">NA</span>
                )}
              </TableCell>
              <TableCell className="px-4 py-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
                    app.status
                  )}`}
                >
                  {app.status || "Pending"}
                </span>
              </TableCell>
              <TableCell className="px-4 py-2">
                <div className="flex gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(status, app._id)}
                      className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectApplicantsTable;
