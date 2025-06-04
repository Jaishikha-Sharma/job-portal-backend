import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";

const statusColors = {
  rejected: "bg-red-500 text-white",
  pending: "bg-gray-400 text-white",
  "on hold": "bg-yellow-400 text-black",
  accepted: "bg-green-500 text-white",
};

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  const validAppliedJobs = allAppliedJobs?.filter(
    (appliedJob) => appliedJob?.job && appliedJob?.job?.company
  );

  return (
    <div className="bg-white rounded-lg p-4">

      {/* Mobile View: Card Layout */}
      <div className="md:hidden space-y-4">
        {validAppliedJobs.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            You haven't applied to any jobs yet.
          </p>
        ) : (
          validAppliedJobs.map((appliedJob) => (
            <div
              key={appliedJob._id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-semibold text-gray-800">
                  {appliedJob.job?.title}
                </h3>
                <Badge
                  className={`text-xs font-semibold ${
                    statusColors[appliedJob.status.toLowerCase()] ||
                    "bg-gray-300 text-black"
                  }`}
                >
                  {appliedJob.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Company:</span> {appliedJob.job?.company?.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Date:</span>{" "}
                {appliedJob?.createdAt?.split("T")[0]}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-full">
          <TableCaption className="text-gray-500 text-sm italic">
            A list of your applied jobs
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="py-3 px-4 text-left">Date</TableHead>
              <TableHead className="py-3 px-4 text-left">Job Role</TableHead>
              <TableHead className="py-3 px-4 text-left">Company</TableHead>
              <TableHead className="py-3 px-4 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validAppliedJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-6">
                  You haven't applied to any jobs yet.
                </TableCell>
              </TableRow>
            ) : (
              validAppliedJobs.map((appliedJob, idx) => (
                <TableRow
                  key={appliedJob._id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="py-3 px-4">
                    {appliedJob?.createdAt?.split("T")[0]}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {appliedJob.job?.title}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {appliedJob.job?.company?.name}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-right">
                    <Badge
                      className={`inline-block px-3 py-1 rounded-full font-semibold ${
                        statusColors[appliedJob.status.toLowerCase()] ||
                        "bg-gray-300 text-black"
                      }`}
                    >
                      {appliedJob.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AppliedJobTable;
