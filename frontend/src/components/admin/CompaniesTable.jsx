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
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CompaniesTable = () => {
  return (
    <div className="w-full mt-5">
      {/* Responsive wrapper */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
        <Table className="min-w-[500px]">
          <TableCaption className="text-sm text-gray-500 mb-2">
            A list of your recently registered companies
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-gray-700">Logo</TableHead>
              <TableHead className="text-gray-700">Name</TableHead>
              <TableHead className="text-gray-700">Date</TableHead>
              <TableHead className="text-right text-gray-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-gray-50 transition">
              <TableCell>
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                    alt="Company Logo"
                  />
                </Avatar>
              </TableCell>
              <TableCell className="font-medium whitespace-nowrap">
                Company Name
              </TableCell>
              <TableCell className="text-gray-600 whitespace-nowrap">
                10-08-2023
              </TableCell>
              <TableCell className="text-right">
                <Popover>
                    <PopoverTrigger>
                        <MoreHorizontal/>
                    </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div>
                      <Edit2 />
                      <span>Edit</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompaniesTable;
