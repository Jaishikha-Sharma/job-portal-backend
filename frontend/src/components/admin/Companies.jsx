import React from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "../../hooks/useGetAllCompanies";
import { useSelector } from "react-redux";

const Companies = () => {
  useGetAllCompanies();
  const navigate = useNavigate();

  // companies Redux store se lena
  const { companies } = useSelector((store) => store.company);

  // check karna ki limit cross hui ya nahi
  const isLimitReached = companies.length >= 5;

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between">
          <Input className="w-fit" placeholder="Filter by name" />
          <Button
            onClick={() => navigate("/admin/companies/create")}
            disabled={isLimitReached} 
          >
            New Company
          </Button>
        </div>

        {isLimitReached && (
          <p className="text-red-500 mt-2">
            You have reached the maximum limit of 5 companies.
          </p>
        )}

        <CompaniesTable />
      </div>
    </div>
  );
};

export default Companies;
