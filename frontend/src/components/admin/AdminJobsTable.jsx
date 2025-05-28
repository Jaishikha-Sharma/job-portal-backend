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
import {
  Edit2,
  Eye,
  MoreHorizontal,
  Linkedin,
  Copy,
  MessageCircle,
} from "lucide-react";
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
        <img src="/no-result.avif" alt="No jobs" className="mx-auto h-40" />
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
    <div className="mt-6">
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
        <Table className="min-w-full">
          <TableCaption className="text-gray-600 font-medium">
            A list of your recently posted jobs
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead className="text-gray-700 py-3 px-6 text-left">
                Company Name
              </TableHead>
              <TableHead className="text-gray-700 py-3 px-6 text-left">
                Role
              </TableHead>
              <TableHead className="text-gray-700 py-3 px-6 text-left">
                Date
              </TableHead>
              <TableHead className="text-right text-gray-700 py-3 px-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterJobs.map((job) => (
              <TableRow
                key={job._id}
                className="hover:bg-red-50/50 transition-colors duration-200"
              >
                <TableCell className="font-semibold text-gray-800 py-4 px-6">
                  {job?.company?.name}
                </TableCell>
                <TableCell className="text-gray-700 py-4 px-6">
                  {job?.title}
                </TableCell>
                <TableCell className="text-gray-600 py-4 px-6">
                  {job?.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell className="text-right py-4 px-6">
                  <Popover>
                    <PopoverTrigger className="hover:text-[#f83002] transition cursor-pointer">
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-44 shadow-lg border border-gray-200 rounded-md p-2">
                      <div className="flex flex-col gap-2">
                        <div
                          onClick={() =>
                            navigate(`/admin/companies/${job._id}`)
                          }
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#f83002] hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </div>
                        <div
                          onClick={() =>
                            navigate(`/admin/jobs/${job._id}/applicants`)
                          }
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#f83002] hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Applicants</span>
                        </div>
                        <div className="flex justify-around pt-1 border-t border-gray-200 mt-1">
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(
                              `${window.location.origin}/job/${job._id}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-[#25D366]"
                            title="Share on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                              `${window.location.origin}/job/${job._id}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-[#0077B5]"
                            title="Share on LinkedIn"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${window.location.origin}/job/${job._id}`
                              );
                              alert("Link copied to clipboard!");
                            }}
                            className="text-gray-600 hover:text-gray-900"
                            title="Copy link"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
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

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {filterJobs.map((job) => (
          <div
            key={job._id}
            className="bg-white shadow-sm rounded-lg p-4 border"
          >
            <div className="mb-2">
              <strong>Company:</strong> {job?.company?.name}
            </div>
            <div className="mb-2">
              <strong>Role:</strong> {job?.title}
            </div>
            <div className="mb-2">
              <strong>Date:</strong> {job?.createdAt?.split("T")[0]}
            </div>
            <div className="text-right">
              <Popover>
                <PopoverTrigger>
                  <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-44 shadow-lg border border-gray-200 rounded-md p-2">
                  <div className="flex flex-col gap-2">
                    <div
                      onClick={() => navigate(`/admin/companies/${job._id}`)}
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#f83002] hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate(`/admin/jobs/${job._id}/applicants`)
                      }
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#f83002] hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Applicants</span>
                    </div>
                    <div className="flex justify-around pt-1 border-t border-gray-200 mt-1">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `${window.location.origin}/job/${job._id}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#25D366]"
                        title="Share on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                          `${window.location.origin}/job/${job._id}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#0077B5]"
                        title="Share on LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${window.location.origin}/job/${job._id}`
                          );
                          alert("Link copied to clipboard!");
                        }}
                        className="text-gray-600 hover:text-gray-900"
                        title="Copy link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminJobsTable;
