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
    <div className="overflow-x-auto rounded-lg shadow-md bg-white">
      <Table className="min-w-[600px]">
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
                <TableCell className="py-3 px-4">{appliedJob.job?.title}</TableCell>
                <TableCell className="py-3 px-4">{appliedJob.job?.company?.name}</TableCell>
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
  );
};

export default AppliedJobTable;
