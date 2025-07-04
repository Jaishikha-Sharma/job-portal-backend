import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { Notification } from "../models/notification.model.js";
import { Project } from "../models/project.model.js";


export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    const { answers } = req.body; // get answers from request body

    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required.",
        success: false,
      });
    }

    // Validate answers
    if (!Array.isArray(answers)) {
      return res.status(400).json({
        message: "Answers must be an array.",
        success: false,
      });
    }
    for (const ans of answers) {
      if (
        !ans.hasOwnProperty("question") ||
        !ans.hasOwnProperty("answer") ||
        typeof ans.question !== "string" ||
        typeof ans.answer !== "string"
      ) {
        return res.status(400).json({
          message: "Each answer must contain a question and answer string.",
          success: false,
        });
      }
    }

    // Get UTC start and end of today for date filtering
    const today = new Date();
    const todayStart = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
        0,
        0,
        0
      )
    );
    const todayEnd = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    // Count how many applications user made today
    const applicationsToday = await Application.countDocuments({
      applicant: userId,
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    if (applicationsToday >= 5) {
      return res.status(429).json({
        message: "You have reached the daily limit of 5 job applications.",
        success: false,
      });
    }

    // Check if the user has already applied for this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job.",
        success: false,
      });
    }

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // Create a new application with answers
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
      answers,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
    });
  } catch (error) {
    console.log("Error in applyJob:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });
    if (!application) {
      return res.status(404).json({
        message: "No Applications",
        success: false,
      });
    }
    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Admin can see who applied for a job
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }

    // Populate applicant and job to get user id and job title
    const application = await Application.findOne({ _id: applicationId })
      .populate('applicant')
      .populate('job'); // Assuming your Application model has a 'job' ref field

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // Update application status
    application.status = status.toLowerCase();
    await application.save();

    // Create notification for the applicant with job info
    const jobTitle = application.job?.title || "the job";
    const notificationMessage = `Your application for "${jobTitle}" has been updated to "${application.status}".`;

    await Notification.create({
      userId: application.applicant._id,
      message: notificationMessage,
      type: "application",
      read: false,
    });

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
export const applyToProject = async (req, res) => {
  try {
    const userId = req.id;
    const projectId = req.params.id;

    // Check if already applied
    const alreadyApplied = await Application.findOne({
      applicant: userId,
      project: projectId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You have already applied to this project.",
        success: false,
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        success: false,
      });
    }

    const newApp = await Application.create({
      project: projectId,
      applicant: userId,
      answers: [
        { question: "N/A", answer: "N/A" }, // 👈 to satisfy required schema
      ],
    });

    return res.status(201).json({
      message: "Project applied successfully.",
      success: true,
    });
  } catch (error) {
    console.log("Error in applyToProject:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
export const getAppliedProjects = async (req, res) => {
  try {
    const userId = req.id;

    const applications = await Application.find({
      applicant: userId,
      project: { $ne: null },
    }).populate({
      path: "project",
      populate: {
        path: "createdBy",
        select: "fullname email",
      },
    });

    const validProjects = applications
      .map((app) => app.project)
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      projects: validProjects,
    });
  } catch (error) {
    console.log("Error in getAppliedProjects:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};


export const getProjectApplicants = async (req, res) => {
  try {
    const projectId = req.params.id;

    const applications = await Application.find({ project: projectId })
      .populate("applicant", "fullname email");

    return res.status(200).json({ success: true, applicants: applications });
  } catch (error) {
    console.error("Error in getProjectApplicants:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
