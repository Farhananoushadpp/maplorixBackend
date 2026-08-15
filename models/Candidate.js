import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true, default: "" },
    fullName: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    mobile: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    nationality: { type: String, default: "Not specified" },
    currentlyLocated: { type: String, default: "Not specified" },
    visaStatus: { type: String, default: "" },
    industry: { type: String, default: "General Profile" },
    attachedCv: { type: mongoose.Schema.Types.Mixed, default: "" },
    resume: { type: mongoose.Schema.Types.Mixed, default: "" },
    originalCvName: { type: String, default: "" },
    status: { type: String, default: "Active Candidate" },
  },
  { timestamps: true }
);

candidateSchema.index({ email: 1 });
candidateSchema.index({ mobile: 1 });
candidateSchema.index({ createdAt: -1 });

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
