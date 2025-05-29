import { Job } from "../models/job.model.js";

// ADMIN - Create a new job
export const postJob = async (req, res) => {
  console.log("📥 Incoming Request Body =>", req.body);

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
    } = req.body;
    const userId = req.id;

    // Basic validation
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
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

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
      company: companyId,
      created_by: userId,
    });
    console.log("✅ Job created:", job);

    return res.status(201).json({
      message: "New job created successfully.",
      job,
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
