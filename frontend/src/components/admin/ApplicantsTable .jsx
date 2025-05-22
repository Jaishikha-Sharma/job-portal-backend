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

    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
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
          {applicants?.applications?.map((item) => (
            <TableRow
              key={item._id}
              className="hover:shadow-md transition-shadow bg-white rounded-lg"
            >
              <TableCell className="px-4 py-3 font-medium text-gray-800">
                {item?.applicant?.fullname}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-700">
                {item?.applicant?.email}
              </TableCell>
              <TableCell className="px-4 py-3">
                {item.applicant?.profile?.resume ? (
                  <a
                    href={item?.applicant?.profile?.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    {item?.applicant?.profile?.resumeOriginalName}
                  </a>
                ) : (
                  <span className="text-gray-400 italic">NA</span>
                )}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-600">
                {item?.applicant.createdAt.split("T")[0]}
              </TableCell>

              {/* STATUS BADGE */}
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

              {/* ACTION MENU */}
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
  );
};

export default ApplicantsTable;
