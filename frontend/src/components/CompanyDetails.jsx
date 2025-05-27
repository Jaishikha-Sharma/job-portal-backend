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
        const { data } = await axios.get(
          `${COMPANY_API_END_POINT}/get/${companyId}`,
          { withCredentials: true }
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
      <p className="text-center text-gray-500 mt-10">Loading company details...</p>
    );
  if (error)
    return (
      <p className="text-center text-red-500 mt-10 font-semibold">{error}</p>
    );

  return (
    <>
      {/* Back Button */}
      <div className="max-w-3xl mx-auto mt-6 px-4">
        <button
          onClick={handleBack}
          className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md text-sm font-medium transition"
        >
          &#8592; Back
        </button>
      </div>

      <div className="max-w-3xl mx-auto p-8 mt-6 bg-white rounded-xl shadow-md border border-gray-200">
        {/* Company Logo & Name */}
        <div className="flex items-center space-x-6 mb-6">
          {company.logo ? (
            <img
              src={company.logo}
              alt={`${company.name} Logo`}
              className="w-20 h-20 object-contain rounded-md border border-gray-300"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md text-gray-500 font-semibold text-lg">
              N/A
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-800">{company.name}</h2>
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
          {company.description || "No description available."}
        </p>

        {/* Website & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800">
          <div>
            <h3 className="text-md font-semibold mb-1">Website</h3>
            {company.website ? (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-blue-600 break-all"
              >
                {company.website}
              </a>
            ) : (
              <p className="text-gray-500">No website provided</p>
            )}
          </div>

          <div>
            <h3 className="text-md font-semibold mb-1">Location</h3>
            <p>{company.location || "Location not specified"}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyDetails;
