import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "../../hooks/useGetAllCompanies";
import { useSelector, useDispatch } from "react-redux";
import { setSearchCompanyByText } from "../../redux/companySlice";
import Joyride from "react-joyride";
import { Plus } from "lucide-react";

const Companies = () => {
  useGetAllCompanies();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const { user } = useSelector((store) => store.auth);

  const isLimitReached = companies.length >= 5;
  const [runTour, setRunTour] = useState(false);

  const steps = [
    {
      target: "#search-company-input",
      content: "Search your company here by name.",
    },
    {
      target: "#new-company-btn",
      content: "Click here to add a new company.",
    },
    {
      target: "#companies-table-section",
      content: "All your registered companies will appear here.",
    },
  ];

  useEffect(() => {
    if (user?._id) {
      const seen = localStorage.getItem(`hasSeenTour-${user._id}`);
      if (seen !== "true") {
        setRunTour(true);
      }
    }
  }, [user]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = ["finished", "skipped"];
    if (finishedStatuses.includes(status) && user?._id) {
      localStorage.setItem(`hasSeenTour-${user._id}`, "true");
      setRunTour(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: "#f83002",
          },
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
          <Input
            id="search-company-input"
            value={searchCompanyByText}
            onChange={(e) => dispatch(setSearchCompanyByText(e.target.value))}
            placeholder="🔍 Search companies by name..."
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f83002]"
          />

          <Button
            id="new-company-btn"
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
        <div id="companies-table-section" className="mt-8">
          <CompaniesTable />
        </div>
      </div>

      <Button
        onClick={() => navigate("/admin/jobs/create")}
        className="fixed bottom-8 right-8 z-50 bg-[#f83002] hover:bg-[#d72000] text-white px-5 py-3 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95"
      >
        <Plus size={18} />
        <span className="text-sm font-semibold">Create Jobs</span>
      </Button>
    </div>
  );
};

export default Companies;
