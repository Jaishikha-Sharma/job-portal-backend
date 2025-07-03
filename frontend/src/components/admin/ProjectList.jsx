import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjects, deleteProject } from "../../redux/projectSlice"; // ✅ Import delete

const ProjectList = () => {
  const dispatch = useDispatch();
  const { allProjects, loading, error } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  const handleDelete = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(deleteProject(projectId));
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
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
