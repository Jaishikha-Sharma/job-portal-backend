import React, { useState } from "react";
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

const experienceYears = Array.from({ length: 21 }, (_, i) => `${i} years`);

const PostJob = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 1,
    companyId: "",
    qualification: "",
    customQualification: "",
    genderPreference: "",
    languagesKnown: "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
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

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
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
                <Label>Job Title</Label>
                <Input
                  list="jobTitles"
                  name="title"
                  value={input.title}
                  onChange={changeEventHandler}
                  placeholder="Select or type a job title"
                  className="focus-visible:ring-blue-500 my-2"
                  required
                />
                <datalist id="jobTitles">
                  {popularJobTitles.map((title) => (
                    <option key={title} value={title} />
                  ))}
                </datalist>
              </div>

              <div>
                <Label>Job Type</Label>
                <select
                  name="jobType"
                  value={input.jobType}
                  onChange={jobTypeChangeHandler}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 my-2"
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
                <Label>Experience</Label>
                <select
                  name="experience"
                  value={input.experience}
                  onChange={changeEventHandler}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 my-2"
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
                <Label>No. of Positions</Label>
                <Input
                  type="number"
                  name="position"
                  value={input.position}
                  onChange={changeEventHandler}
                  className="focus-visible:ring-blue-500 my-2"
                  min={1}
                  required
                />
              </div>

              <div>
                <Label>Candidate Qualification</Label>
                <select
                  name="qualification"
                  value={input.qualification}
                  onChange={changeEventHandler}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 my-2"
                  required
                >
                  <option value="">Select Qualification</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MBA">MBA</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="Other">Other</option>
                </select>
                {input.qualification === "Other" && (
                  <Input
                    type="text"
                    name="customQualification"
                    value={input.customQualification}
                    onChange={changeEventHandler}
                    placeholder="Enter your qualification"
                    className="focus-visible:ring-blue-500 my-2"
                  />
                )}
              </div>

              <div>
                <Label>Gender Preference</Label>
                <select
                  name="genderPreference"
                  value={input.genderPreference}
                  onChange={changeEventHandler}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 my-2"
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
                  onChange={changeEventHandler}
                  placeholder="e.g. English, Hindi, Tamil"
                  className="focus-visible:ring-blue-500 my-2"
                />
              </div>
            </div>
          )}

          {/* Step 2: Location, Salary, Company */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Location</Label>
                <Input
                  list="locations"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  placeholder="Hybrid, Remote or start typing location"
                  className="focus-visible:ring-blue-500 my-2"
                  required
                />
                <datalist id="locations">
                  <option value="Hybrid" />
                  <option value="Remote" />
                  {indianLocations.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>

              <div>
                <Label>Salary</Label>
                <Input
                  type="text"
                  name="salary"
                  value={input.salary}
                  onChange={changeEventHandler}
                  placeholder="e.g. 5 LPA"
                  className="focus-visible:ring-blue-500 my-2"
                  required
                />
              </div>

              {companies.length > 0 && (
                <div>
                  <Label>Company</Label>
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
                            value={company?.name?.toLowerCase()}
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
            </div>
          )}

          {/* Step 3: Requirements and Description */}
          {step === 3 && (
            <div>
              <div>
                <Label>Requirements</Label>
                <Input
                  type="text"
                  name="requirements"
                  value={input.requirements}
                  onChange={changeEventHandler}
                  className="focus-visible:ring-blue-500 my-2"
                  placeholder="Comma separated e.g. React, Node.js, SQL"
                  required
                />
              </div>

              <div className="mt-6">
                <Label>Description</Label>
                <textarea
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  rows={5}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 my-2"
                  placeholder="Describe the job, responsibilities, culture..."
                  required
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="px-6 py-2"
              >
                Back
              </Button>
            )}

            {step < 3 && (
              <Button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-2"
              >
                Next
              </Button>
            )}

            {step === 3 && (
              <Button
                type="submit"
                className="ml-auto px-6 py-2 flex items-center gap-2"
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin" size={18} />}
                Post Job
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
