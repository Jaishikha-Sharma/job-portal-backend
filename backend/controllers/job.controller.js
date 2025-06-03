import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";

// ADMIN - Create a new job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
      qualification,
      degree,
      genderPreference,
      languagesKnown,
      questions, // Added questions here
    } = req.body;

    const userId = req.id;
    console.log("User ID from req.id:", userId);  

    // Validation
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      console.log("Validation failed: Missing required fields");
      return res
        .status(400)
        .json({ message: "Required fields missing.", success: false });
    }

    // Create job
    const job = await Job.create({
      title,
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : requirements.split(",").map((r) => r.trim()),
      salary,
      location,
      jobType,
      experienceLevel: experience,
      position,
      qualification,
      degree,
      genderPreference,
      languagesKnown,
      questions: Array.isArray(questions)
        ? questions
        : questions
        ? questions.split(",").map((q) => q.trim())
        : [],
      company: companyId,
      created_by: userId,
    });

    console.log("Job created with ID:", job._id);

    // Notify all users (excluding recruiters)
    const users = await User.find({ role: "student" });
    console.log("Number of students found:", users.length);
    console.log("Students:", users.map(u => ({ id: u._id, email: u.email })));

    const notifications = users.map((user) => ({
      userId: user._id,
      message: `New job posted: ${job.title}`,
      type: "job",
    }));

    await Notification.insertMany(notifications);
    console.log("Notifications inserted:", notifications.length);

    return res
      .status(201)
      .json({
        message: "Job created",
        job,
        success: true,
      });
  } catch (error) {
    console.error("Error in postJob:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message, success: false });
  }
};

// STUDENT - Get all jobs with optional keyword search
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate("company")
      .populate("created_by", "fullname")
      .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      success: false,
    });
  }
};

// STUDENT - Get a single job by ID
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
      .populate("applications")
      .populate("company")
      .populate("created_by", "fullname");

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      success: false,
    });
  }
};

// ADMIN - Get jobs created by current admin
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .populate("created_by", "fullname")
      .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      success: false,
    });
  }
};

// Update a job by ID
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const existingJob = await Job.findById(jobId);

    if (!existingJob) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      qualification,
      degree,
      genderPreference,
      languagesKnown,
      questions, // Added questions here
      companyId,
    } = req.body;

    const updatedFields = {
      ...(title && { title }),
      ...(description && { description }),
      ...(requirements && {
        requirements: Array.isArray(requirements)
          ? requirements
          : requirements.split(",").map((r) => r.trim()),
      }),
      ...(salary && { salary }),
      ...(location && { location }),
      ...(jobType && { jobType }),
      ...(experience && { experienceLevel: experience }),
      ...(position && { position }),
      ...(qualification && { qualification }),
      ...(degree && { degree }),
      ...(genderPreference && { genderPreference }),
      ...(languagesKnown && { languagesKnown }),
      ...(questions && {
        questions: Array.isArray(questions)
          ? questions
          : questions.split(",").map((q) => q.trim()),
      }),
      ...(companyId && { company: companyId }),
    };

    const updatedJob = await Job.findByIdAndUpdate(jobId, updatedFields, {
      new: true,
    }).populate("company");

    return res.status(200).json({
      message: "Job updated successfully.",
      job: updatedJob,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      success: false,
    });
  }
};

// ADMIN - Delete a job by ID
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    await Job.findByIdAndDelete(jobId);

    return res.status(200).json({
      message: "Job deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      success: false,
    });
  }
};
