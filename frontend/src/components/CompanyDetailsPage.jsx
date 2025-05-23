import React from "react";
import { useParams } from "react-router-dom";
import CompanyDetails from "./CompanyDetails";
import Navbar from "./shared/Navbar"

const CompanyDetailsPage = () => {
  const { id } = useParams();

  return (
 <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
          Company Details
        </h1>
        <CompanyDetails companyId={id} />
      </div>
    </div>
 </>
  );
};

export default CompanyDetailsPage;
