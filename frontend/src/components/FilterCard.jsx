import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";

const FilterCard = ({ isMobile = false, jobs = [] }) => {
  const uniqueLocations = Array.from(
    new Set(jobs.map((job) => job.location).filter(Boolean))
  );

  const filterData = [
    {
      filterType: "Location",
      array: uniqueLocations.length > 0 ? uniqueLocations : ["No locations"],
    },
    {
      filterType: "Industry",
      array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
    },
    {
      filterType: "Salary",
      array: ["0-40k", "42-1lakh", "1lakh to 5lakh"],
    },
  ];

  const [selectedFilters, setSelectedFilters] = useState({
    Location: "",
    Industry: "",
    Salary: "",
  });

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
    </div>
  );
};

export default FilterCard;
