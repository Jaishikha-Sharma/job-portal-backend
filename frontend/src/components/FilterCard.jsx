import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";

const FilterCard = ({ isMobile = false, jobs = [] }) => {
  // Extract unique locations
  const uniqueLocations = Array.from(
    new Set(jobs.map((job) => job.location).filter(Boolean))
  );

  // Extract unique industries from job titles
  const uniqueIndustries = Array.from(
    new Set(jobs.map((job) => job.title).filter(Boolean))
  );

  // Extract unique salaries and sort them ascending
  const uniqueSalaries = Array.from(
    new Set(jobs.map((job) => job.salary).filter(Boolean))
  ).sort((a, b) => a - b);

  // Extract unique experience levels
  const uniqueExperienceLevels = Array.from(
    new Set(jobs.map((job) => job.experienceLevel).filter(Boolean))
  );

  // Extract unique job types
  const uniqueJobTypes = Array.from(
    new Set(jobs.map((job) => job.jobType).filter(Boolean))
  );

  // Extract unique qualifications
  const uniqueQualifications = Array.from(
    new Set(jobs.map((job) => job.qualification).filter(Boolean))
  );

  // Extract unique gender preferences
  const uniqueGenderPreferences = Array.from(
    new Set(jobs.map((job) => job.genderPreference).filter(Boolean))
  );

  // Extract unique languages known (assuming array in each job)
  const uniqueLanguagesKnown = Array.from(
    new Set(
      jobs
        .flatMap((job) => job.languagesKnown || [])
        .filter(Boolean)
    )
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

  // Initial selected filters state
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

  const dispatch = useDispatch();

  // Update selected filters on user interaction
  const changeHandler = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Dispatch filter changes to redux store
  useEffect(() => {
    dispatch(setSearchedQuery(selectedFilters));
  }, [selectedFilters, dispatch]);

  // Filter jobs based on selectedFilters
  const filteredJobs = jobs.filter((job) => {
    if (
      selectedFilters.Location &&
      job.location !== selectedFilters.Location
    )
      return false;

    if (
      selectedFilters.Industry &&
      job.title !== selectedFilters.Industry
    )
      return false;

    if (
      selectedFilters.Salary &&
      job.salary?.toString() !== selectedFilters.Salary
    )
      return false;

    if (
      selectedFilters["Experience Level"] &&
      job.experienceLevel !== selectedFilters["Experience Level"]
    )
      return false;

    if (
      selectedFilters["Job Type"] &&
      job.jobType !== selectedFilters["Job Type"]
    )
      return false;

    if (
      selectedFilters.Qualification &&
      job.qualification !== selectedFilters.Qualification
    )
      return false;

    if (
      selectedFilters["Gender Preference"] &&
      job.genderPreference !== selectedFilters["Gender Preference"]
    )
      return false;

    if (
      selectedFilters["Languages Known"] &&
      (!job.languagesKnown ||
        !job.languagesKnown.includes(selectedFilters["Languages Known"]))
    )
      return false;

    return true;
  });

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 to-white border border-gray-200 p-6 rounded-2xl shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800 mb-5">Filter Jobs</h1>

      {isMobile ? (
        // Mobile: Scrollable button filters
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
                    className={`shrink-0 text-xs transition-colors ${
                      selectedFilters[section.filterType] === item
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "hover:border-gray-400"
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
        // Desktop: Radio filter groups
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
                      <div key={itemId} className="flex items-center gap-3">
                        <RadioGroupItem
                          value={item}
                          id={itemId}
                          className="border-gray-300 text-indigo-600 focus:ring-indigo-400"
                        />
                        <Label
                          htmlFor={itemId}
                          className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer transition-colors"
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

      {/* Display filtered jobs */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">
          Filtered Jobs ({filteredJobs.length})
        </h2>
        {filteredJobs.length === 0 ? (
          <p>No jobs found for selected filters.</p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-auto border p-3 rounded">
            {filteredJobs.map((job) => (
              <li key={job.id} className="border-b pb-2">
                <p>
                  <strong>{job.title}</strong> - {job.location}
                </p>
                <p>Salary: {job.salary}</p>
                <p>Experience: {job.experienceLevel}</p>
                <p>Job Type: {job.jobType}</p>
                <p>Qualification: {job.qualification}</p>
                <p>Gender Preference: {job.genderPreference}</p>
                <p>Languages: {job.languagesKnown?.join(", ")}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FilterCard;
