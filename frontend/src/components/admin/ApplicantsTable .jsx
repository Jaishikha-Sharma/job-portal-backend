import React from "react";
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
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "../../utils/constant";
import axios from "axios";

const shortlistingStatus = ["Accepted", "Rejected", "On Hold"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);

  const statusHandler = async (status, id) => {
    const confirm = window.confirm(
      `Are you sure you want to mark this application as "${status}"?`
    );
    if (!confirm) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to update status.");
      return;
    }

    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table className="w-full border-separate border-spacing-y-2 text-sm">
          <TableCaption className="mb-4 text-base font-semibold text-gray-700">
            A list of your recent applied users
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-100 rounded-lg">
              <TableHead className="px-4 py-2 rounded-l-lg">Full Name</TableHead>
              <TableHead className="px-4 py-2">Email</TableHead>
              <TableHead className="px-4 py-2">Resume</TableHead>
              <TableHead className="px-4 py-2">Date</TableHead>
              <TableHead className="px-4 py-2">Status</TableHead>
              <TableHead className="px-4 py-2 text-right rounded-r-lg">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {applicants?.applications
              ?.filter((item) => item?.applicant)
              .map((item) => (
                <TableRow
                  key={item._id}
                  className="hover:shadow-md transition-shadow bg-white rounded-lg"
                >
                  <TableCell className="px-4 py-3 font-medium text-gray-800">
                    {item?.applicant?.fullname || "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700">
                    {item?.applicant?.email || "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {item.applicant?.profile?.resume ? (
                      <a
                        href={item?.applicant?.profile?.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-medium hover:underline"
                      >
                        {item?.applicant?.profile?.resumeOriginalName || "Resume"}
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">NA</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600">
                    {item?.applicant?.createdAt?.split("T")[0] || "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${
                        item.status === "Accepted"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : item.status === "On Hold"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status || "Pending"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <Popover>
                      <PopoverTrigger>
                        <button className="p-1 hover:bg-gray-200 rounded-full">
                          <MoreHorizontal className="w-5 h-5 text-gray-600" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 border rounded shadow-md">
                        {shortlistingStatus.map((status, index) => (
                          <div
                            key={index}
                            onClick={() => statusHandler(status, item?._id)}
                            className="text-sm py-2 px-3 hover:bg-gray-100 rounded cursor-pointer text-gray-800"
                          >
                            {status}
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {applicants?.applications
          ?.filter((item) => item?.applicant)
          .map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-sm rounded-lg p-4 border"
            >
              <div className="mb-2">
                <strong>Full Name:</strong> {item?.applicant?.fullname || "N/A"}
              </div>
              <div className="mb-2">
                <strong>Email:</strong> {item?.applicant?.email || "N/A"}
              </div>
              <div className="mb-2">
                <strong>Resume:</strong>{" "}
                {item.applicant?.profile?.resume ? (
                  <a
                    href={item?.applicant?.profile?.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {item?.applicant?.profile?.resumeOriginalName || "Resume"}
                  </a>
                ) : (
                  <span className="text-gray-400 italic">NA</span>
                )}
              </div>
              <div className="mb-2">
                <strong>Date:</strong>{" "}
                {item?.applicant?.createdAt?.split("T")[0] || "N/A"}
              </div>
              <div className="mb-2">
                <strong>Status:</strong>{" "}
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    item.status === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : item.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : item.status === "On Hold"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.status || "Pending"}
                </span>
              </div>

              {/* Action */}
              <div className="text-right">
                <Popover>
                  <PopoverTrigger>
                    <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                      <MoreHorizontal className="w-5 h-5 text-gray-600" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 border rounded shadow-md">
                    {shortlistingStatus.map((status, index) => {
                      const isActive = item.status === status;
                      return (
                        <div
                          key={index}
                          onClick={() => statusHandler(status, item?._id)}
                          className={`flex items-center gap-2 text-sm py-2 px-3 rounded cursor-pointer transition 
                            ${
                              isActive
                                ? status === "Accepted"
                                  ? "bg-green-100 text-green-700 font-semibold"
                                  : status === "Rejected"
                                  ? "bg-red-100 text-red-700 font-semibold"
                                  : "bg-yellow-100 text-yellow-800 font-semibold"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              status === "Accepted"
                                ? "bg-green-500"
                                : status === "Rejected"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                          />
                          {status}
                        </div>
                      );
                    })}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ApplicantsTable;
