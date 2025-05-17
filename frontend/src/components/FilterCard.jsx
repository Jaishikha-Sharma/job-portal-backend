import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";

// Filter configuration
const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
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

const FilterCard = ({ isMobile = false }) => {
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

  // Dispatch filters to Redux store whenever selection changes
  useEffect(() => {
    dispatch(setSearchedQuery(selectedFilters));
  }, [selectedFilters, dispatch]);

  return (
    <div className="w-full bg-[#f9f9f9] p-4 rounded-xl shadow-sm border border-gray-200">
      <h1 className="font-semibold text-xl text-gray-800 mb-4">Filter Jobs</h1>

      {isMobile ? (
        // Mobile layout: horizontal scrollable buttons
        <div className="space-y-4">
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
                    className="shrink-0 text-xs"
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
        // Desktop layout: vertical radio groups
        <div>
          {filterData.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-gray-700 font-medium text-lg mb-2 border-b pb-1">
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
                          className="border-gray-300 text-primary"
                        />
                        <Label
                          htmlFor={itemId}
                          className="text-sm text-gray-600 cursor-pointer hover:text-gray-800"
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
