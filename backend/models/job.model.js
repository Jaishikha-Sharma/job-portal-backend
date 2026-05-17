import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required() {
        return this.status !== "draft";
      },
    },
    description: {
      type: String,
      required() {
        return this.status !== "draft";
      },
    },
    requirements: [
      {
        type: String,
      },
    ],
    salary: {
      type: String,
      required() {
        return this.status !== "draft";
      },
    },
    location: {
      type: String,
      required() {
        return this.status !== "draft";
      },
    },
    jobType: {
      type: String,
      required() {
        return this.status !== "draft";
      },
    },
    position: {
      type: String,
      required() {
        return this.status !== "draft";
      },
    },
    qualification: {
      type: String,
      required() {
        return this.status !== "draft";
      },
    },
    degree: {
      type: String,
      required() {
        return this.status !== "draft";
      },
    },
    genderPreference: {
      type: String,
      required() {
        return this.status !== "draft";
      },
    },
    languagesKnown: [{ type: String, default: [] }],
    experienceLevel: { type: String, default: "" },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required() {
        return this.status !== "draft";
      },
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    questions: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
