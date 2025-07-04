import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  PROJECT_API_END_POINT,
  APPLICATION_API_END_POINT,
} from "../utils/constant.js";
import Navbar from "./shared/Navbar.jsx";

const PublicProjects = () => {
  const [projects, setProjects] = useState([]);
  const [appliedIds, setAppliedIds] = useState([]);
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAppliedOnly, setShowAppliedOnly] = useState(false);

  const token = localStorage.getItem("token");

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${PROJECT_API_END_POINT}/public-projects`);
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error("Error loading projects", err);
      alert("Error loading projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplied = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/applied-projects`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const projectArray = res.data.projects || [];
      setAppliedIds(projectArray.map((p) => p._id));
      setAppliedProjects(projectArray);
    } catch (err) {
      console.error("Error fetching applied projects", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    if (token) fetchApplied();
  }, []);

  const applyToProject = async (projectId) => {
    try {
      await axios.post(
        `${APPLICATION_API_END_POINT}/apply-project/${projectId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Applied successfully!");
      fetchApplied();
    } catch (err) {
      console.error("Error applying to project", err);
      alert(err.response?.data?.message || "Error applying to project");
    }
  };

  const projectsToShow = showAppliedOnly ? appliedProjects : projects;

  return (
    <>
      <Navbar />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-center w-full">
            Available Projects
          </h2>
          {token && (
            <Button
              variant="outline"
              onClick={() => setShowAppliedOnly((prev) => !prev)}
              className="absolute right-6"
            >
              {showAppliedOnly ? "Show All Projects" : "Show My Applied Projects"}
            </Button>
          )}
        </div>

        {loading ? (
          <p className="text-center">Loading projects...</p>
        ) : projectsToShow.length === 0 ? (
          <p className="text-center">
            {showAppliedOnly
              ? "You haven’t applied to any projects yet."
              : "No public projects found."}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projectsToShow.map((project) => (
              <div
                key={project._id}
                className="p-5 border rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white w-full max-w-full mx-auto"
              >
                <div className="text-gray-400 text-xs mb-2">
                  Posted:{" "}
                  {project.createdAt
                    ? new Date(project.createdAt).toLocaleDateString()
                    : "N/A"}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {project.title}
                </h3>

                <p className="text-sm text-gray-500 italic mb-2">
                  Posted by: {project.createdBy?.fullname || "Unknown"}
                </p>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="ghost" className="text-blue-600 text-xs sm:text-sm">
                    Budget: ₹{project.budget}
                  </Badge>
                  <Badge variant="ghost" className="text-green-600 text-xs sm:text-sm">
                    Duration: {project.duration}
                  </Badge>
                  {project.skillsRequired?.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="ghost"
                      className="text-purple-700 text-xs sm:text-sm"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                <Button
                  className="w-full bg-[#6a38c2] text-white hover:bg-[#5c2fbf]"
                  onClick={() => {
                    if (!token) {
                      alert("Please login to apply.");
                      return;
                    }
                    applyToProject(project._id);
                  }}
                  disabled={token && appliedIds.includes(project._id)}
                >
                  {!token
                    ? "Login to Apply"
                    : appliedIds.includes(project._id)
                    ? "Already Applied"
                    : "Apply Now"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PublicProjects;
