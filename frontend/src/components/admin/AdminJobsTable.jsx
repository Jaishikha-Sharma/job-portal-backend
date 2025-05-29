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
  Trash2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteJob } from "../../redux/deleteJobThunk.js";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleDelete = async (jobId) => {
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (!confirm) return;

    try {
      await dispatch(deleteJob(jobId)).unwrap();
      alert("Job deleted successfully.");
    } catch (err) {
      console.error("Failed to delete job:", err);
      alert("Something went wrong while deleting the job.");
    }
  };

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
    <>
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-md overflow-x-auto mt-6 border border-gray-200">
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
                className="hover:bg-red-50/50 transition-colors duration-200 cursor-default"
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
                            navigate(`/admin/jobs/edit/${job._id}`)
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

                        <div
                          onClick={() => handleDelete(job._id)}
                          className="flex items-center gap-2 text-sm text-red-600 hover:text-white hover:bg-red-600 p-2 rounded-md cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
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
      <div className="md:hidden mt-6 space-y-4">
        {filterJobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  {job.title}
                </h3>
                <p className="text-gray-600">{job.company?.name}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Posted on: {job.createdAt?.split("T")[0]}
                </p>
              </div>
              <Popover>
                <PopoverTrigger className="hover:text-[#f83002] transition cursor-pointer">
                  <MoreHorizontal />
                </PopoverTrigger>
                <PopoverContent className="w-44 shadow-lg border border-gray-200 rounded-md p-2">
                  <div className="flex flex-col gap-2">
                    <div
                      onClick={() => navigate(`/admin/jobs/edit/${job._id}`)}
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

                    <div
                      onClick={() => handleDelete(job._id)}
                      className="flex items-center gap-2 text-sm text-red-600 hover:text-white hover:bg-red-600 p-2 rounded-md cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
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
    </>
  );
};

export default AdminJobsTable;
