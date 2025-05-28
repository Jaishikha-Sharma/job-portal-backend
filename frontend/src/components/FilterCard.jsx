import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";

const FilterCard = ({ isMobile = false, jobs = [] }) => {
  // Unique value extraction (same as before)
  const uniqueLocations = Array.from(
    new Set(jobs.map((job) => job.location).filter(Boolean))
  );
  const uniqueIndustries = Array.from(
    new Set(jobs.map((job) => job.title).filter(Boolean))
  );
  const uniqueSalaries = Array.from(
    new Set(jobs.map((job) => job.salary).filter(Boolean))
  ).sort((a, b) => a - b);
  const uniqueExperienceLevels = Array.from(
    new Set(jobs.map((job) => job.experienceLevel).filter(Boolean))
  );
  const uniqueJobTypes = Array.from(
    new Set(jobs.map((job) => job.jobType).filter(Boolean))
  );
  const uniqueQualifications = Array.from(
    new Set(jobs.map((job) => job.qualification).filter(Boolean))
  );
  const uniqueGenderPreferences = Array.from(
    new Set(jobs.map((job) => job.genderPreference).filter(Boolean))
  );
  const uniqueLanguagesKnown = Array.from(
    new Set(jobs.flatMap((job) => job.languagesKnown || []).filter(Boolean))
  );

  const filterData = [
    {
      filterType: "Location",
      array: uniqueLocations.length > 0 ? uniqueLocations : ["No locations"],
    },
    {
      filterType: "Industry",
      array: uniqueIndustries.length > 0 ? uniqueIndustries : ["No industries"],
    },
    {
      filterType: "Salary",
      array:
        uniqueSalaries.length > 0
          ? uniqueSalaries.map((salary) => salary.toString())
          : ["No salary data"],
    },
    {
      filterType: "Experience Level",
      array:
        uniqueExperienceLevels.length > 0
          ? uniqueExperienceLevels
          : ["No experience data"],
    },
    {
      filterType: "Job Type",
      array: uniqueJobTypes.length > 0 ? uniqueJobTypes : ["No job types"],
    },
    {
      filterType: "Qualification",
      array:
        uniqueQualifications.length > 0
          ? uniqueQualifications
          : ["No qualification data"],
    },
    {
      filterType: "Gender Preference",
      array:
        uniqueGenderPreferences.length > 0
          ? uniqueGenderPreferences
          : ["No preference"],
    },
    {
      filterType: "Languages Known",
      array: uniqueLanguagesKnown.length > 0 ? uniqueLanguagesKnown : ["N/A"],
    },
  ];

  const [selectedFilters, setSelectedFilters] = useState({
    Location: "",
    Industry: "",
    Salary: "",
    "Experience Level": "",
    "Job Type": "",
    Qualification: "",
    "Gender Preference": "",
    "Languages Known": "",
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const dispatch = useDispatch();

  const changeHandler = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedFilters));
  }, [selectedFilters, dispatch]);

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 to-white border border-gray-200 p-6 rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-gray-800">Filter Jobs</h1>
        {isMobile && (
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-indigo-600 font-semibold focus:outline-none"
            aria-expanded={mobileOpen}
            aria-label="Toggle filter panel"
          >
            {mobileOpen ? "Close Filters" : "Open Filters"}
          </button>
        )}
      </div>

      {(!isMobile || mobileOpen) && (
        <>
          {isMobile ? (
            <div className="space-y-5">
              {filterData.map((section, index) => (
                <div key={index}>
                  <h2 className="text-sm font-semibold text-gray-700 mb-2">
                    {section.filterType}
                  </h2>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {section.array.map((item, idx) => (
                      <Button
                        key={idx}
                        variant={
                          selectedFilters[section.filterType] === item
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className={`shrink-0 text-xs transition-colors rounded-full ${
                          selectedFilters[section.filterType] === item
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "border-indigo-400 text-indigo-600 hover:bg-indigo-100"
                        }`}
                        onClick={() => changeHandler(section.filterType, item)}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {filterData.map((section, index) => (
                <div key={index} className="mb-6">
                  <h2 className="text-gray-700 font-medium text-lg mb-3 border-b pb-2">
                    {section.filterType}
                  </h2>
                  <RadioGroup
                    value={selectedFilters[section.filterType]}
                    onValueChange={(value) =>
                      changeHandler(section.filterType, value)
                    }
                  >
                    <div className="space-y-2">
                      {section.array.map((item, idx) => {
                        const itemId = `id-${section.filterType}-${idx}`;
                        return (
                          <div
                            key={itemId}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <RadioGroupItem
                              value={item}
                              id={itemId}
                              className="border-gray-300 text-indigo-600 focus:ring-indigo-400"
                            />
                            <Label
                              htmlFor={itemId}
                              className="text-sm text-gray-700 hover:text-indigo-700 transition-colors"
                            >
                              {item}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FilterCard;
