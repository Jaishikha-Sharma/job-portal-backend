import { Project } from "../models/project.model.js";

// Create Project
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      budget,
      duration,
      skillsRequired,
      category,
    } = req.body;

    const newProject = new Project({
      title,
      description,
      budget,
      duration,
      skillsRequired,
      category,
      createdBy: req.id, // ✅ Set from isAuthenticated middleware
    });

    await newProject.save();

    res.status(201).json({
      message: "Project posted successfully",
      project: newProject,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
};

// Get all projects (for logged-in recruiter only)
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.id }).populate(
      "createdBy",
      "fullname email"
    );

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};

// Delete project (only if created by the current user)
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
    res.status(500).json({ message: "Error deleting project", error });
  }
};
