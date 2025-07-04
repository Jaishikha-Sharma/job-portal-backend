import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProjects,
  deleteProject,
} from "../../redux/projectSlice";
import axios from "axios";
import { setProjectApplicants } from "../../redux/applicationSlice";
import { APPLICATION_API_END_POINT } from "../../utils/constant";

const ProjectList = () => {
  const dispatch = useDispatch();
  const { allProjects, loading, error } = useSelector((state) => state.project);
  const { projectApplicants } = useSelector((state) => state.application);
  const [openProjectId, setOpenProjectId] = useState(null);

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  const handleDelete = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(deleteProject(projectId));
    }
  };

  const toggleApplicants = async (projectId) => {
    const token = localStorage.getItem("token");
    if (openProjectId === projectId) {
      setOpenProjectId(null);
      return;
    }

    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/project/${projectId}/applicants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setProjectApplicants(res.data.applicants));
      setOpenProjectId(projectId);
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">All Projects</h2>

      {loading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">⚠️ {error}</p>}

      {allProjects.length === 0 && !loading ? (
        <p>No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allProjects
            .filter((project) => project && project.title)
            .map((project) => (
              <div
                key={project._id}
                className="bg-white shadow p-4 rounded border border-blue-100 relative"
              >
                <button
                  onClick={() => handleDelete(project._id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                >
                  🗑 Delete
                </button>

                <h3 className="text-lg font-semibold text-blue-900">
                  {project.title}
                </h3>
                <p className="text-gray-600">{project.description}</p>
                <p className="text-sm mt-2 text-gray-500">
                  💰 Budget: {project.budget} | ⏳ Duration: {project.duration}
                </p>
                <p className="text-sm text-gray-500">
                  📁 Category: {project.category}
                </p>
                <p className="text-sm text-gray-500">
                  🛠 Skills:{" "}
                  {Array.isArray(project.skillsRequired)
                    ? project.skillsRequired.join(", ")
                    : project.skillsRequired}
                </p>

                <button
                  onClick={() => toggleApplicants(project._id)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {openProjectId === project._id ? "Hide Applicants" : "View Applicants"}
                </button>

                {/* Applicants Table */}
                {openProjectId === project._id && projectApplicants && (
                  <div className="mt-4 bg-gray-50 p-3 rounded border text-sm max-h-60 overflow-auto">
                    <h4 className="font-semibold mb-2 text-blue-800">
                      👥 Applicants ({projectApplicants.length})
                    </h4>

                    {projectApplicants.length === 0 ? (
                      <p className="text-gray-500 italic">No one has applied yet.</p>
                    ) : (
                      <table className="w-full border border-gray-200 text-sm">
                        <thead className="bg-gray-100 text-left">
                          <tr>
                            <th className="p-2">Name</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Resume</th>
                            <th className="p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projectApplicants.map((app) => (
                            <tr key={app._id} className="border-t">
                              <td className="p-2">{app?.applicant?.fullname || "N/A"}</td>
                              <td className="p-2">{app?.applicant?.email || "N/A"}</td>
                              <td className="p-2">
                                {app.applicant?.profile?.resume ? (
                                  <a
                                    href={app.applicant.profile.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                  >
                                    Resume
                                  </a>
                                ) : (
                                  <span className="text-gray-400 italic">NA</span>
                                )}
                              </td>
                              <td className="p-2 capitalize">
                                {app.status || "Pending"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
