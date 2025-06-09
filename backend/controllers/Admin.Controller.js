import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";

// GET all users (except admins)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ success: false, message: "Cannot delete admin" });

    await User.findByIdAndDelete(userId);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET all companies with user info
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate("userId", "fullname email");
    res.status(200).json({ success: true, companies });
  } catch (error) {
    console.error("Get companies error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// TOGGLE company approval
export const toggleCompanyApproval = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    company.isApproved = !company.isApproved;
    await company.save();

    res.status(200).json({
      success: true,
      message: `Company ${company.isApproved ? "approved" : "disapproved"} successfully`,
      company,
    });
  } catch (error) {
    console.error("Toggle approval error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET all jobs (admin)
export const getAllJobsForAdmin = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }); // Optional: sort newest first
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("Get all jobs error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE a job by ID
export const deleteJobByAdmin = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    await Job.findByIdAndDelete(jobId);
    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
