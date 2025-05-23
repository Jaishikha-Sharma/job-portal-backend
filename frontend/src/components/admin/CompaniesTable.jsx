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
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteCompany } from "../../redux/companySlice";

const CompaniesTable = () => {
  const dispatch = useDispatch();
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const [filterCompany, setFilterCompany] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = companies.filter((company) =>
      !searchCompanyByText
        ? true
        : company.name.toLowerCase().includes(searchCompanyByText.toLowerCase())
    );
    setFilterCompany(filtered);
  }, [companies, searchCompanyByText]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      dispatch(deleteCompany(id))
        .unwrap()
        .catch((err) => {
          console.error("Failed to delete company", err);
          alert("Failed to delete company");
        });
    }
  };

  if (filterCompany.length === 0) {
    return (
      <div className="text-center mt-10">
        <img
          src="/no-result.avif"
          alt="No companies"
          className="mx-auto h-40"
        />
        <h3 className="text-lg font-semibold mt-4 text-gray-800">
          No Companies Found
        </h3>
        <p className="text-gray-500">
          Try adding a new company or change your search.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-x-auto mt-6">
      <Table>
        <TableCaption className="text-gray-600 font-medium">
          List of your registered companies
        </TableCaption>

        <TableHeader>
          <TableRow className="bg-gray-200">
            <TableHead className="text-gray-700">Logo</TableHead>
            <TableHead className="text-gray-700">Name</TableHead>
            <TableHead className="text-gray-700">Date</TableHead>
            <TableHead className="text-right text-gray-700">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filterCompany.map((company) => (
            <TableRow
              key={company._id}
              className="hover:bg-red-50/50 transition-colors duration-200"
            >
              <TableCell>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={company.logo} />
                </Avatar>
              </TableCell>
              <TableCell className="font-semibold text-gray-800">
                {company.name}
              </TableCell>
              <TableCell className="text-gray-600">
                {company.createdAt?.split("T")[0]}
              </TableCell>
              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger className="hover:text-[#f83002] transition">
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-40 shadow-lg border border-gray-200 rounded-md">
                    <div className="p-2">
                      <div
                        onClick={() =>
                          navigate(`/admin/companies/${company._id}`)
                        }
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#f83002] hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </div>
                      <div
                        onClick={() => handleDelete(company._id)}
                        className="flex items-center gap-2 text-sm text-red-600 hover:text-[#f83002] hover:bg-red-50 p-2 rounded-md cursor-pointer mt-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        <span>Delete</span>
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

export default CompaniesTable;
