import { Project } from "../models/project.model.js";

// ✅ Create Project
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      budget,
      duration,
      skillsRequired,
      category,
      isPublic = true, // default to true if not provided
    } = req.body;

    const newProject = new Project({
      title,
      description,
      budget,
      duration,
      skillsRequired,
      category,
      isPublic,
      createdBy: req.id, // ✅ from isAuthenticated middleware
    });

    await newProject.save();

    res.status(201).json({
      message: "Project posted successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Error creating project", error });
  }
};

// ✅ Get all projects created by logged-in user
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.id }).populate(
      "createdBy",
      "fullname email"
    );

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching all projects:", error);
    res.status(500).json({ message: "Error fetching projects", error });
  }
};

// ✅ Delete a project (only if owned by user)
export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project || project.createdBy.toString() !== req.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized or project not found" });
    }

    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Error deleting project", error });
  }
};

// ✅ Get all public projects (accessible to anyone)
export const getPublicProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isPublic: true })
      .populate("createdBy", "fullname email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching public projects:", error);
    res
      .status(500)
      .json({ message: "Error fetching public projects", error });
  }
};
