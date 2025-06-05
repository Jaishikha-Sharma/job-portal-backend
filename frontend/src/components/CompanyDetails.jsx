import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { COMPANY_API_END_POINT } from "../utils/constant";
import { useNavigate } from "react-router-dom";

const CompanyDetails = ({ companyId }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!companyId) return;

    const fetchCompanyDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${COMPANY_API_END_POINT}/get/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setCompany(data.company);
          setError("");
        } else {
          setError("Company details not found");
          setCompany(null);
        }
      } catch (err) {
        setError("Failed to fetch company details");
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [companyId]);

  const handleBack = () => {
    navigate("/jobs");
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 dark:text-gray-300 mt-10">
        Loading company details...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 font-semibold mt-10">{error}</p>
    );

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1"
        >
          ← Back to Jobs
        </button>
      </div>

      {/* Company Header */}
      <div className="flex items-center gap-6 mb-6">
        {company.logo ? (
          <img
            src={company.logo}
            alt={company.name}
            className="w-20 h-20 object-cover border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 font-semibold">
            N/A
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {company.name}
          </h2>
          {company.industry && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {company.industry}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          About the Company
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {company.description || "No description available."}
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Website */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Website
          </h4>
          {company.website ? (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline break-words"
            >
              {company.website}
            </a>
          ) : (
            <p className="text-gray-500">Not available</p>
          )}
        </div>

        {/* Location */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Location
          </h4>
          <p className="text-gray-800 dark:text-gray-200">
            {company.location || "Not specified"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
