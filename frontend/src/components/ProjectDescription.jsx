import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { APPLICATION_API_END_POINT, PROJECT_API_END_POINT } from "../utils/constant";
import Navbar from "./shared/Navbar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

const ProjectDescription = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [applied, setApplied] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${PROJECT_API_END_POINT}/${id}`);
        setProject(res.data.project);
      } catch (err) {
        console.error(err);
        toast.error("Project not found.");
      }
    };

    const checkApplied = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/applied-projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const appliedIds = res.data.projects.map((p) => p._id);
        setApplied(appliedIds.includes(id));
      } catch (err) {
        console.log("Check applied failed");
      }
    };

    fetchProject();
    if (token) checkApplied();
  }, [id, token]);

  const applyHandler = async () => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply-project/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      setApplied(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error applying to project.");
    }
  };

  if (!project) return <div className="text-center mt-10 text-gray-600">Loading project...</div>;

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-2xl shadow-xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate(-1)} className="text-sm">
            ← Back to Projects
          </Button>
        </div>

        {/* Project Title */}
        <h1 className="text-3xl font-bold text-purple-700 mb-4">{project.title}</h1>

        {/* Project Details */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Badge className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
            Budget: ₹{project.budget}
          </Badge>
          <Badge className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
            Duration: {project.duration}
          </Badge>
          <Badge className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
            Category: {project.category}
          </Badge>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Project Description</h2>
          <p className="text-gray-600 leading-relaxed">{project.description}</p>
        </div>

        {/* Terms of Payment ✅ */}
        {project.termsOfPayment && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Terms of Payment</h2>
            <p className="text-gray-600 leading-relaxed">{project.termsOfPayment}</p>
          </div>
        )}

        {/* Skills Required */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Skills Required</h2>
          {Array.isArray(project.skillsRequired) && project.skillsRequired.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {project.skillsRequired.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="italic text-gray-500">Not specified</p>
          )}
        </div>

        {/* Apply Button */}
        <div className="mt-6">
          {token ? (
            <Button
              className="bg-purple-700 text-white hover:bg-purple-800 px-6 py-2 text-sm rounded-lg"
              disabled={applied}
              onClick={applyHandler}
            >
              {applied ? "✅ Already Applied" : "Apply Now"}
            </Button>
          ) : (
            <p className="text-sm text-gray-600 italic">
              Please login to apply for this project.
            </p>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-10 text-xs text-gray-400 italic text-right">
          Posted on: {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </div>
    </>
  );
};

export default ProjectDescription;
