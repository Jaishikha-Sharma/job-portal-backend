import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjects, deleteProject } from "../../redux/projectSlice";
import axios from "axios";
import { setProjectApplicants } from "../../redux/applicationSlice";
import { APPLICATION_API_END_POINT } from "../../utils/constant";
import ProjectApplicantsTable from "../admin/ProjectApplicantsTable";

const ProjectList = () => {
  const dispatch = useDispatch();
  const { allProjects, loading, error } = useSelector((state) => state.project);
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
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">List of Your Posted Projects</h2>

      {loading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">⚠️ {error}</p>}

      {allProjects.length === 0 && !loading ? (
        <p>No projects found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Budget</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Skills</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allProjects
                .filter((project) => project && project.title)
                .map((project) => (
                  <React.Fragment key={project._id}>
                    <tr className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 text-blue-900 font-medium">{project.title}</td>
                      <td className="px-6 py-4">{project.budget}</td>
                      <td className="px-6 py-4">{project.duration}</td>
                      <td className="px-6 py-4">
                        {project.company?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        {Array.isArray(project.skillsRequired)
                          ? project.skillsRequired.join(", ")
                          : project.skillsRequired}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleApplicants(project._id)}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {openProjectId === project._id ? "Hide Applicants" : "View Applicants"}
                          </button>
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="text-sm text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>

                    {openProjectId === project._id && (
                      <tr>
                        <td colSpan="6" className="bg-gray-50 p-4">
                          <ProjectApplicantsTable />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
