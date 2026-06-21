import mongoose from "mongoose";

const mistakeSchema = new mongoose.Schema(
  {
    issue: { type: String, required: true }, // what's wrong
    why: { type: String, required: true }, // why it hurts the candidate
    fix: { type: String, required: true }, // concrete fix to apply
    severity: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
  },
  { _id: false }
);

const screeningSchema = new mongoose.Schema(
  {
    candidateName: { type: String, default: "Unknown candidate" },
    fileName: { type: String, required: true },
    jobTitle: { type: String, default: "" },
    jobDescription: { type: String, required: true },
    resumeText: { type: String, required: true },

    matchScore: { type: Number, min: 0, max: 100, required: true },
    verdict: {
      type: String,
      enum: ["strong_fit", "possible_fit", "weak_fit"],
      required: true,
    },
    summary: { type: String, required: true },

    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],

    mistakes: [mistakeSchema],
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Screening", screeningSchema);
