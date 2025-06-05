import React from "react";
import { useParams } from "react-router-dom";
import CompanyDetails from "./CompanyDetails";
import Navbar from "./shared/Navbar";

const CompanyDetailsPage = () => {
  const { id } = useParams();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
            Company Overview
          </h1>
          <CompanyDetails companyId={id} />
        </div>
      </div>
    </>
  );
};

export default CompanyDetailsPage;
