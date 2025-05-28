import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import { JOB_API_END_POINT } from "../../utils/constant";
import { useSelector } from "react-redux";
import Navbar from "../shared/Navbar.jsx"
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const jobTypes = [
  "Full-Time",
  "Part-Time",
  "Internship",
  "Contract",
  "Freelance",
];

const degrees = [
  "B.Sc",
  "B.A",
  "B.Com",
  "B.Tech",
  "M.Sc",
  "M.A",
  "M.Com",
  "M.Tech",
  "PhD",
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

const salaryRanges = [
  "1 LPA - 3 LPA",
  "3 LPA - 5 LPA",
  "5 LPA - 7 LPA",
  "7 LPA - 10 LPA",
  "10 LPA+",
];

const experienceYears = Array.from({ length: 21 }, (_, i) => `${i} years`);

const JobUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`);
        if (res.data.success) {
          const job = res.data.job;

          setFormData({
            title: job.title || "",
            description: job.description || "",
            requirements: job.requirements?.length ? job.requirements : [""],
            salary: job.salary || "",
            location: job.location || "",
            jobType: job.jobType || "",
            experience: job.experience || "",
            position: job.position || 1,
            companyId: job.companyId || "",
            qualification: job.qualification || "",
            degree: job.degree || "",
            customQualification: job.customQualification || "",
            genderPreference: job.genderPreference || "",
            languagesKnown: job.languagesKnown || "",
          });
        }
      } catch (err) {
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRequirementChange = (index, value) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements[index] = value;
    setFormData((prev) => ({
      ...prev,
      requirements: updatedRequirements,
    }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      requirements: updatedRequirements.length > 0 ? updatedRequirements : [""],
    }));
  };

  const selectCompanyByName = (companyNameLower) => {
    const company = companies.find(
      (c) => c.name.toLowerCase() === companyNameLower.toLowerCase()
    );
    setFormData((prev) => ({
      ...prev,
      companyId: company?._id || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${JOB_API_END_POINT}/update/${id}`,
        formData
      );
      if (res.data.success) {
        alert("Job updated successfully!");
        navigate("/admin/jobs");
      }
    } catch (err) {
      console.error("Error updating job:", err);
      alert("Failed to update job");
    }
  };

  if (loading) return <p>Loading...</p>;

return (
  <>
    <Navbar />
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-xl rounded-xl border border-gray-200">
      <h2 className="text-3xl font-semibold mb-8 text-gray-900">Edit Job</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Input Group */}
        <div>
          <Label className="block mb-2 text-gray-700 font-semibold">Job Title</Label>
          <Input
            list="jobTitles"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Select or type a job title"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#f83002] transition"
          />
          <datalist id="jobTitles">
            {[
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
            ].map((title) => (
              <option key={title} value={title} />
            ))}
          </datalist>
        </div>

        {/* Select Group */}
        <div>
          <Label className="block mb-2 text-gray-700 font-semibold">Job Type</Label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#f83002] transition"
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

        {/* Positions */}
        <div>
          <Label className="block mb-2 text-gray-700 font-semibold">No. of Positions</Label>
          <Input
            type="number"
            name="position"
            value={formData.position}
            onChange={handleChange}
            min={1}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#f83002] transition"
          />
        </div>

        {/* Candidate Qualification */}
        <div>
          <Label className="block mb-2 text-gray-700 font-semibold">Candidate Qualification</Label>
          <select
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#f83002] transition"
          >
            <option value="">Select Qualification</option>
            <option value="10th">10th</option>
            <option value="12th">12th</option>
            <option value="Graduation">Graduation</option>
            <option value="Post Graduation">Post Graduation</option>
            <option value="Other">Other</option>
          </select>
          {formData.qualification === "Other" && (
            <Input
              type="text"
              name="customQualification"
              value={formData.customQualification}
              onChange={handleChange}
              placeholder="Enter your qualification"
              className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#f83002] transition"
            />
          )}
        </div>

        {/* Degree */}
        <div>
          <Label className="block mb-2 text-gray-700 font-semibold">Degree</Label>
          <select
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#f83002] transition"
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

        {/* Gender Preference */}
        <div>
          <Label className="block mb-2 text-gray-700 font-semibold">Gender Preference</Label>
          <select
            name="genderPreference"
            value={formData.genderPreference}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#f83002] transition"
          >
            <option value="" disabled>
              Select Gender Preference
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="No Preference">No Preference</option>
          </select>
        </div>

        {/* Languages Known */}
        <div>
          <Label className="block mb-2 text-gray-700 font-semibold">Languages Known</Label>
          <Input
            type="text"
            name="languagesKnown"
            value={formData.languagesKnown}
            onChange={handleChange}
            placeholder="e.g. English, Hindi, Tamil"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#f83002] transition"
          />
        </div>

        {/* Location */}
        <div>
          <Label className="block mb-2 text-gray-700 font-semibold">Location</Label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#f83002] transition"
          >
            <option value="" disabled>
              Select Location
            </option>
            {indianLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Salary */}
        <div>
          <Label className="block mb-2 text-gray-700 font-semibold">Salary</Label>
          <select
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#f83002] transition"
          >
            <option value="" disabled>
              Select Salary Range
            </option>
            {salaryRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        {/* Requirements */}
        <div>
          <Label className="block mb-4 text-gray-700 font-semibold">Requirements</Label>
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex items-center mb-4 gap-4">
              <Input
                type="text"
                value={req}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                placeholder={`Requirement #${index + 1}`}
                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#f83002] transition"
                required
              />
              {formData.requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="text-[#f83002] hover:text-[#c12700] font-bold text-3xl leading-none select-none"
                  title="Remove requirement"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addRequirement}
            className="text-[#f83002] hover:text-[#c12700] font-semibold"
          >
            + Add Requirement
          </button>
        </div>

        {/* Description */}
        <div>
          <Label className="block mb-2 text-gray-700 font-semibold">Job Description</Label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            placeholder="Enter job description"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#f83002] transition resize-none"
            required
          />
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full bg-[#f83002] text-white py-4 rounded-lg hover:bg-[#c12700] transition font-semibold text-lg"
          >
            Update Job
          </button>
        </div>
      </form>
    </div>
  </>
);

};

export default JobUpdate;
