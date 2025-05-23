import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;
      const searchLower = searchJobByText.toLowerCase();
      return (
        job?.title?.toLowerCase().includes(searchLower) ||
        job?.company?.name.toLowerCase().includes(searchLower)
      );
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  if (filterJobs.length === 0) {
    return (
      <div className="text-center mt-10">
        <img
          src="/no-jobs.svg"
          alt="No jobs"
          className="mx-auto h-40"
        />
        <h3 className="text-lg font-semibold mt-4 text-gray-800">
          No Jobs Found
        </h3>
        <p className="text-gray-500">
          Try adding a new job or adjust your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-x-auto mt-6 border border-gray-200">
      <Table className="min-w-full">
        <TableCaption className="text-gray-600 font-medium">
          A list of your recently posted jobs
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-200">
            <TableHead className="text-gray-700 py-3 px-6 text-left">
              Company Name
            </TableHead>
            <TableHead className="text-gray-700 py-3 px-6 text-left">Role</TableHead>
            <TableHead className="text-gray-700 py-3 px-6 text-left">Date</TableHead>
            <TableHead className="text-right text-gray-700 py-3 px-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs.map((job) => (
            <TableRow
              key={job._id}
              className="hover:bg-red-50/50 transition-colors duration-200 cursor-default"
            >
              <TableCell className="font-semibold text-gray-800 py-4 px-6">
                {job?.company?.name}
              </TableCell>
              <TableCell className="text-gray-700 py-4 px-6">{job?.title}</TableCell>
              <TableCell className="text-gray-600 py-4 px-6">
                {job?.createdAt?.split("T")[0]}
              </TableCell>
              <TableCell className="text-right py-4 px-6">
                <Popover>
                  <PopoverTrigger className="hover:text-[#f83002] transition cursor-pointer">
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-40 shadow-lg border border-gray-200 rounded-md">
                    <div className="p-2">
                      <div
                        onClick={() => navigate(`/admin/companies/${job._id}`)}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#f83002] hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </div>
                      <div
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#f83002] hover:bg-gray-100 p-2 rounded-md cursor-pointer mt-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Applicants</span>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
