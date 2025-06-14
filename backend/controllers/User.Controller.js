import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phoneNumber,
      password,
      role,
      dob,
      address,
      pincode,
      linkedin,
    } = req.body;

    if (
      !fullname ||
      !email ||
      !password ||
      !phoneNumber ||
      !role ||
      !linkedin ||
      !pincode ||
      !dob
    ) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    let profilePhotoUrl = "";

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: profilePhotoUrl,
        dob,
        address,
        pincode,
        linkedin,
      },
    });

    return res.status(201).json({
      message: "Account Created!",
      success: true,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Server error during registration",
      success: false,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect Email or Password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect Email or Password",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account does not exist with current role",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: `Welcome Back ${user.fullname}`,
      token, // ✅ Send token to client to store in localStorage
      user,
      success: true,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error during login",
      success: false,
    });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Logout successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Server error during logout",
      success: false,
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const {
      fullname,
      email,
      bio,
      phoneNumber,
      skills,
      dob,
      address,
      pincode,
      linkedin,
    } = req.body;

    const file = req.file;
    let cloudResponse;

    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }

    let skillsArray = [];
    if (skills) {
      skillsArray = skills.split(",");
    }

    const userId = req.id; // comes from auth middleware
    let user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    user.fullname = fullname;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.profile.bio = bio;
    user.profile.dob = dob || user.profile.dob;
    user.profile.address = address || user.profile.address;
    user.profile.pincode = pincode || user.profile.pincode;
    user.profile.linkedin = linkedin || user.profile.linkedin;
    user.profile.skills = skillsArray;

    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated!",
      user,
      success: true,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      message: "Server error during profile update",
      success: false,
    });
  }
};

// SAVE a job
export const saveJob = async (req, res) => {
  try {
    const userId = req.id; // from auth middleware
    const { jobId } = req.params;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.profile.savedJobs.includes(jobId)) {
      return res
        .status(400)
        .json({ success: false, message: "Job already saved" });
    }

    user.profile.savedJobs.push(jobId);
    await user.save();

    res.status(200).json({ success: true, message: "Job saved" });
  } catch (err) {
    console.error("Save job error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UNSAVE a job
export const unsaveJob = async (req, res) => {
  try {
    const userId = req.id;
    const { jobId } = req.params;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.profile.savedJobs = user.profile.savedJobs.filter(
      (id) => id.toString() !== jobId
    );
    await user.save();

    res.status(200).json({ success: true, message: "Job unsaved" });
  } catch (err) {
    console.error("Unsave job error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.id; // from isAuthenticated middleware

    const user = await User.findById(userId).populate({
      path: "profile.savedJobs",
      populate: { path: "company" }, // 👈 this will populate company details inside each job
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    return res.status(200).json({
      savedJobs: user.profile.savedJobs,
      success: true,
    });
  } catch (error) {
    console.error("Get saved jobs error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// GOOGLE LOGIN
export const googleLogin = async (req, res) => {
  try {
    const { email, fullname, role } = req.body;

    if (!email || !fullname || !role) {
      return res.status(400).json({
        success: false,
        message: "Missing email, fullname, or role",
      });
    }

    if (!["student", "recruiter"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullname,
        email,
        role,
        profile: {},
      });
    } else if (user.role !== role) {
      return res.status(400).json({
        success: false,
        message: `Account already exists with role: ${user.role}`,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      success: true,
      message: `Welcome ${user.fullname}`,
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Google Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during Google login",
    });
  }
};

