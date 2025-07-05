import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProject } from "../../redux/projectSlice";
import ProjectList from "./ProjectList";
import Navbar from "../../components/shared/Navbar.jsx";

const steps = ["Project Info", "Budget", "Skills"];

const PostProjectForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.project);
  const { companies } = useSelector((state) => state.company);

  const [step, setStep] = useState(1);
  const [showProjects, setShowProjects] = useState(false);
  const [currency, setCurrency] = useState("INR");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    termsOfPayment: "",
    budget: "",
    duration: "",
    skillsRequired: "",
    company: "", // now storing ObjectId
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      budget: `${currency === "INR" ? "₹" : "$"}${formData.budget}`,
      skillsRequired: formData.skillsRequired
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      await dispatch(createProject(finalData)).unwrap();
      alert("✅ Project posted successfully!");
      setFormData({
        title: "",
        description: "",
        termsOfPayment: "",
        budget: "",
        duration: "",
        skillsRequired: "",
        company: "",
      });
      setStep(1);
    } catch (err) {
      alert(`❌ Failed to post project: ${err}`);
    }
  };

  const StepUI = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter project title"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Project Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter project description"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Budget *
              </label>
              <div className="flex gap-2 items-center">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-2 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="INR">₹ (INR)</option>
                  <option value="USD">$ (USD)</option>
                </select>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter budget"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. 1 month"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Terms of Payment
              </label>
              <textarea
                name="termsOfPayment"
                value={formData.termsOfPayment}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. 50% advance, 50% after delivery"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Skills Required (comma separated)
              </label>
              <input
                type="text"
                name="skillsRequired"
                value={formData.skillsRequired}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. React, Node.js"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Company Name *
              </label>
              {companies.length > 0 ? (
                <select
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select a Company</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-red-500 text-sm">
                  * No companies found. Please add a company first.
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto flex justify-end mt-6 px-4">
        <button
          onClick={() => setShowProjects(!showProjects)}
          className="fixed right-8 z-50 bg-[#f83002] hover:bg-[#d72000] text-white px-5 py-3 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          {showProjects ? "Hide Projects" : "Show Projects"}
        </button>
      </div>

      {!showProjects ? (
        <div className="max-w-4xl mx-auto mt-6 p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Post a New Project
          </h2>

          <div className="w-full flex justify-between mb-10">
            {steps.map((label, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center relative"
              >
                {index > 0 && (
                  <div
                    className={`absolute top-4 -left-1/2 w-full h-1 ${
                      step > index ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  ></div>
                )}
                <div
                  className={`z-10 w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                    step === index + 1
                      ? "bg-blue-600 text-white"
                      : step > index + 1
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {index + 1}
                </div>
                <p
                  className={`mt-2 text-sm ${
                    step === index + 1
                      ? "text-blue-600 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {StepUI()}
          </form>

          <div className="flex justify-between pt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="ml-auto px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300"
              >
                {loading ? "Posting..." : "Submit"}
              </button>
            )}
          </div>
          {error && <p className="text-red-500 text-sm mt-2">⚠️ {error}</p>}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto mt-8 border-t pt-6 border-blue-300">
          <ProjectList />
        </div>
      )}
    </>
  );
};

export default PostProjectForm;
