import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProject } from "../../redux/projectSlice";
import ProjectList from "./ProjectList";
import Navbar from "../../components/shared/Navbar.jsx";

const steps = ["Basic Info", "Budget", "Skills"];

const PostProjectForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.project);

  const [step, setStep] = useState(1);
  const [showProjects, setShowProjects] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    duration: "",
    skillsRequired: "",
    category: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createProject(formData)).unwrap();
      alert("✅ Project posted successfully!");
      setFormData({
        title: "",
        description: "",
        budget: "",
        duration: "",
        skillsRequired: "",
        category: "",
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project title"
                required
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Enter project description"
                required
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
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter budget"
                required
              />
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 1 month"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Skills Required
              </label>
              <input
                type="text"
                name="skillsRequired"
                value={formData.skillsRequired}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. React, Node.js"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Web Development"
              />
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

      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Post a New Project
        </h2>

        {/* Stepper UI */}
        <div className="w-full flex items-center justify-between mb-10 relative">
          {steps.map((label, index) => (
            <div key={index} className="flex-1 flex flex-col items-center relative">
              {index !== 0 && (
                <div
                  className={`absolute top-4 -left-1/2 w-full h-1 z-0 ${
                    step > index ? "bg-blue-600" : "bg-gray-300"
                  }`}
                ></div>
              )}
              <div
                className={`z-10 w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                  step === index + 1
                    ? "bg-blue-600 text-white"
                    : step > index + 1
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {index + 1}
              </div>
              <p
                className={`mt-2 text-sm ${
                  step === index + 1 ? "text-blue-600 font-semibold" : "text-gray-500"
                }`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {StepUI()}

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
                type="submit"
                disabled={loading}
                className="ml-auto px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300"
              >
                {loading ? "Posting..." : "Submit"}
              </button>
            )}
          </div>
          {error && <p className="text-red-500 text-sm">⚠️ {error}</p>}
        </form>
      </div>

      {/* Toggle Project List */}
      <div className="max-w-xl mx-auto mt-10 text-center">
        <button
          onClick={() => setShowProjects(!showProjects)}
          className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          {showProjects ? "Hide Projects" : "Show Projects"}
        </button>
      </div>

      {showProjects && (
        <div className="max-w-4xl mx-auto mt-8 border-t pt-6 border-blue-300 transition-all duration-500">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">
            📂 Your Posted Projects
          </h3>
          <ProjectList />
        </div>
      )}
    </>
  );
};

export default PostProjectForm;
