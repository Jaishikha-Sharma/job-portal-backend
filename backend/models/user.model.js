import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "recruiter", "admin"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: { type: String }, //url
      resumeOriginalName: { type: String },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
        type: String,
        default: "",
      },
      dob: { type: Date },
      address: { type: String },
      pincode: { type: String },
      linkedin: { type: String },
      savedJobs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job", 
        },
      ],
    },
  },
  { timestamps: true }
);
export const User = mongoose.model("User", userSchema);
