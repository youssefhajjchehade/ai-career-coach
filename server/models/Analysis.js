const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resumeFileName: {
      type: String,
      default: "Uploaded Resume",
      trim: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    analysisMode: {
      type: String,
      enum: ["ai", "rule-based"],
      default: "rule-based",
    },

    jobTitle: {
      type: String,
      default: "",
      trim: true,
    },

    careerField: {
      type: String,
      default: "",
      trim: true,
    },

    seniorityLevel: {
      type: String,
      default: "",
      trim: true,
    },

    overallFeedback: {
      type: String,
      default: "",
    },

    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    resumeSkills: [String],
    jobSkills: [String],
    matchedSkills: [String],
    missingSkills: [String],
    missingKeywords: [String],
    strengths: [String],
    resumeImprovements: [String],
    suggestions: [String],
    interviewQuestions: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Analysis", analysisSchema);
