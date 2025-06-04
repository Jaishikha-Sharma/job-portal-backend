import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "../../utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const jobTypes = [
  "Full-Time",
  "Part-Time",
  "Internship",
  "Contract",
  "Freelance",
];
const popularJobTitles = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Product Manager",
  "Graphic Designer",
  "Marketing Manager",
  "QA Engineer",
  "DevOps Engineer",
  "AI Engineer",
  "Cloud Engineer",
  "Cybersecurity Analyst",
  "Machine Learning Engineer",
  "Mobile App Developer",
  "Data Engineer",
  "Blockchain Developer",
  "UX/UI Designer",
  "Business Analyst",
  "Site Reliability Engineer",
  "System Administrator",
  "Technical Support Engineer",
  "Database Administrator",
  "Network Engineer",
  "Content Writer",
  "Sales Manager",
  "HR Manager",
  "Project Coordinator",
  "Customer Success Manager",
  "Quality Assurance Analyst",
];

const indianLocations = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "New Delhi",
  "Noida",
  "Gurugram",
  "Chandigarh",
];
const degrees = [
  "B.Sc",
  "B.A",
  "B.Com",
  "B.Tech",
  "BCA",
  "M.Sc",
  "M.A",
  "MCA",
  "M.Com",
  "M.Tech",
  "PhD",
  "other",
];
const salaryRanges = [
  "1 LPA - 3 LPA",
  "3 LPA - 5 LPA",
  "5 LPA - 7 LPA",
  "7 LPA - 10 LPA",
  "10 LPA+",
];
const experienceYears = Array.from({ length: 21 }, (_, i) => `${i} years`);

const predefinedQuestions = [
  "Why do you want to work with us?",
  "Describe a challenging project you worked on.",
  "What are your strengths and weaknesses?",
  "Where do you see yourself in 5 years?",
  "How do you handle tight deadlines?",
  "Are you willing to relocate?",
];

const RequiredLabel = ({ children }) => (
  <Label>
    {children}
    <span className="text-red-400 ml-1">*</span>
  </Label>
);

const PostJob = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: [""],
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 1,
    companyId: "",
    qualification: "",
    degree: "",
    customQualification: "",
    genderPreference: "",
    languagesKnown: "",
    questions: [],
  });

  const [jobMode, setJobMode] = useState(""); // "On-site", "Remote", or "Hybrid"

  useEffect(() => {
    // Auto update location field for Remote or Hybrid mode
    if (jobMode === "Remote") {
      setInput((prev) => ({ ...prev, location: jobMode }));
    } else if (jobMode === "On-site") {
      setInput((prev) => ({ ...prev, location: "" }));
    }
  }, [jobMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequirementChange = (index, value) => {
    const updatedRequirements = [...input.requirements];
    updatedRequirements[index] = value;
    setInput((prev) => ({ ...prev, requirements: updatedRequirements }));
  };

  const addRequirement = () => {
    setInput((prev) => ({ ...prev, requirements: [...prev.requirements, ""] }));
  };

  const removeRequirement = (index) => {
    const updatedRequirements = [...input.requirements];
    updatedRequirements.splice(index, 1);
    setInput((prev) => ({ ...prev, requirements: updatedRequirements }));
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany?._id || "" });
  };

  const jobTypeChangeHandler = (e) => {
    setInput({ ...input, jobType: e.target.value });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const token = localStorage.getItem("token");

  const toggleQuestion = (question) => {
    setInput((prev) => {
      const exists = prev.questions.includes(question);
      if (exists) {
        return {
          ...prev,
          questions: prev.questions.filter((q) => q !== question),
        };
      } else {
        return {
          ...prev,
          questions: [...prev.questions, question],
        };
      }
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("You must be logged in to post a job.");
      return;
    }

    // Manual field validation
    const requiredFields = [
      "title",
      "description",
      "salary",
      "location",
      "jobType",
      "experience",
      "position",
      "companyId",
      "qualification",
      "genderPreference",
    ];

    for (const field of requiredFields) {
      if (
        !input[field] ||
        (typeof input[field] === "string" && input[field].trim() === "")
      ) {
        toast.error(`Please fill out the ${field} field.`);
        return;
      }
    }

    if (input.requirements.some((r) => !r.trim())) {
      toast.error("All skill requirements must be filled.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex items-center justify-center w-screen py-8 px-4">
        <form
          onSubmit={submitHandler}
          className="bg-white p-10 rounded-xl shadow-xl max-w-4xl w-full"
        >
          {/* Step Indicator */}
          <div className="flex justify-between mb-10">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`flex-1 text-center py-3 border-b-4 cursor-pointer font-semibold ${
                  step === num
                    ? "border-blue-600 text-blue-600"
                    : "border-gray-300 text-gray-400"
                } transition-colors duration-300`}
                onClick={() => setStep(num)}
              >
                Step {num}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <RequiredLabel>Job Title</RequiredLabel>
                <Input
                  list="jobTitles"
                  name="title"
                  value={input.title}
                  onChange={handleChange}
                  required
                  placeholder="Select or type a job title"
                  className="my-2"
                />
                <datalist id="jobTitles">
                  {popularJobTitles.map((title) => (
                    <option key={title} value={title} />
                  ))}
                </datalist>
              </div>

              <div>
                <RequiredLabel>Job Type</RequiredLabel>
                <select
                  name="jobType"
                  value={input.jobType}
                  onChange={jobTypeChangeHandler}
                  className="w-full p-3 border rounded-md my-2"
                  required
                >
                  <option value="" disabled>
                    Select Job Type
                  </option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <RequiredLabel>Experience</RequiredLabel>
                <select
                  name="experience"
                  value={input.experience}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md my-2"
                  required
                >
                  <option value="" disabled>
                    Select experience
                  </option>
                  {experienceYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <RequiredLabel>No. of Positions</RequiredLabel>
                <Input
                  type="number"
                  name="position"
                  value={input.position}
                  onChange={handleChange}
                  min={1}
                  className="my-2"
                  required
                />
              </div>

              <div>
                <RequiredLabel>Candidate Qualification</RequiredLabel>
                <select
                  name="qualification"
                  value={input.qualification}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md my-2"
                  required
                >
                  <option value="">Select Qualification</option>
                  <option value="10th Pass">10th Pass</option>
                  <option value="12th Pass">12th Pass</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                </select>
              </div>

              <div>
                <Label>Degree</Label>
                <select
                  name="degree"
                  value={input.degree}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md my-2"
                >
                  <option value="" disabled>
                    Select Degree
                  </option>
                  {degrees.map((deg) => (
                    <option key={deg} value={deg}>
                      {deg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <RequiredLabel>Gender Preference</RequiredLabel>
                <select
                  name="genderPreference"
                  value={input.genderPreference}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md my-2"
                  required
                >
                  <option value="">Select Preference</option>
                  <option value="No Preference">No Preference</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <Label>Languages Known</Label>
                <Input
                  type="text"
                  name="languagesKnown"
                  value={input.languagesKnown}
                  onChange={handleChange}
                  placeholder="e.g. English, Hindi"
                  className="my-2"
                />
              </div>
            </div>
          )}

          {/* Step 2: Location, Salary, Company */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Mode Radio Buttons */}
              <div>
                <RequiredLabel>Job Mode</RequiredLabel>
                <div className="flex gap-6 mt-2">
                  {["On-site", "Remote", "Hybrid"].map((mode) => (
                    <label key={mode} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="jobMode"
                        value={mode}
                        checked={jobMode === mode}
                        onChange={(e) => setJobMode(e.target.value)}
                      />
                      {mode}
                    </label>
                  ))}
                </div>
              </div>

              {/* Show location input only if jobMode !== Remote */}
              {jobMode !== "Remote" && (
                <div>
                  <RequiredLabel>Location</RequiredLabel>
                  <Input
                    list="locations"
                    name="location"
                    value={input.location}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="my-2"
                    required={jobMode !== "Remote"}
                  />
                  <datalist id="locations">
                    {indianLocations.map((loc) => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                </div>
              )}

              {companies.length > 0 && (
                <div>
                  <RequiredLabel>Company</RequiredLabel>
                  <Select
                    onValueChange={selectChangeHandler}
                    value={
                      input.companyId
                        ? companies
                            .find((c) => c._id === input.companyId)
                            ?.name.toLowerCase()
                        : ""
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {companies.map((company) => (
                          <SelectItem
                            key={company._id}
                            value={company.name.toLowerCase()}
                          >
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {companies.length === 0 && (
                <p className="text-xs text-red-600 font-bold col-span-full mt-2">
                  *Please register a company first, before posting jobs
                </p>
              )}

              <div>
                <RequiredLabel>Salary</RequiredLabel>
                <select
                  value={input.salaryRange || ""}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      salaryRange: e.target.value,
                      salary: e.target.value,
                    }))
                  }
                  className="w-full p-3 border rounded-md my-2"
                >
                  <option value="">Select Salary Range</option>
                  {salaryRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>

                <Input
                  type="text"
                  name="salary"
                  value={input.salary}
                  onChange={handleChange}
                  placeholder="Or enter salary manually (e.g. 5 LPA)"
                  className="my-2"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Requirements and Description */}
          {step === 3 && (
            <div>
              <div>
                <RequiredLabel>Skills</RequiredLabel>
                {input.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) =>
                        handleRequirementChange(index, e.target.value)
                      }
                      placeholder={`Requirement ${index + 1}`}
                      className="flex-1 p-2 border rounded"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRequirement}
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                >
                  + Add Skill
                </button>
              </div>

              <div className="mt-6">
                <RequiredLabel>Job Description</RequiredLabel>
                <textarea
                  name="description"
                  value={input.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full p-3 border rounded-md my-2"
                  placeholder="Write the detailed job description here"
                  required
                />
              </div>

              <div className="mt-6">
                <h3>
                  <b>Default Questions</b>
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Select questions candidates will be asked to answer
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {predefinedQuestions.map((question) => (
                    <label
                      key={question}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={input.questions.includes(question)}
                        onChange={() => toggleQuestion(question)}
                        className="w-4 h-4"
                      />
                      <span>{question}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10">
            {step > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}

            {step < 3 && <Button onClick={nextStep}>Next</Button>}

            {step === 3 && (
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Submit"
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
