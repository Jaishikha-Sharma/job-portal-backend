import React from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "../../hooks/useGetAllCompanies";
import { useSelector, useDispatch } from "react-redux";
import { setSearchCompanyByText } from "../../redux/companySlice";

const Companies = () => {
  useGetAllCompanies();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { companies, searchCompanyByText } = useSelector((store) => store.company);
  const isLimitReached = companies.length >= 5;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
          <Input
            value={searchCompanyByText}
            onChange={(e) => dispatch(setSearchCompanyByText(e.target.value))}
            placeholder="🔍 Search companies by name..."
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f83002]"
          />

          <Button
            onClick={() => navigate("/admin/companies/create")}
            disabled={isLimitReached}
            className={`w-full sm:w-auto px-5 py-2 text-white font-semibold rounded-lg transition-colors ${
              isLimitReached
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#f83002] hover:bg-[#d72000]"
            }`}
          >
            + New Company
          </Button>
        </div>

        {/* Limit Warning */}
        {isLimitReached && (
          <p className="text-center sm:text-left text-[#f83002] mt-3 font-medium text-sm">
            ⚠️ You have reached the maximum limit of 5 companies.
          </p>
        )}

        {/* Companies Table Section */}
        <div className="mt-8">
          <CompaniesTable />
        </div>
      </div>
    </div>
  );
};

export default Companies;
