import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    type: {
      type: String,
      required: [true, "Job type is required"],
      enum: [
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
        "Remote",
        "Hybrid",
      ],
      default: "Full-time",
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      maxlength: [5000, "Job description cannot exceed 5000 characters"],
    },
    requirements: {
      type: String,
      required: [true, "Job requirements are required"],
      trim: true,
      maxlength: [3000, "Job requirements cannot exceed 3000 characters"],
    },
    salary: {
      min: {
        type: Number,
        min: 0,
      },
      max: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        default: "USD",
        enum: ["USD", "EUR", "GBP", "CAD", "AUD", "INR"],
      },
    },
    category: {
      type: String,
      required: [true, "Job category is required"],
      enum: [
        "Technology",
        "Healthcare",
        "Finance",
        "Marketing",
        "Sales",
        "Education",
        "Engineering",
        "Design",
        "Customer Service",
        "Human Resources",
        "Operations",
        "Legal",
        "Other",
      ],
    },
    experience: {
      type: String,
      required: [true, "Experience level is required"],
      enum: [
        "Entry Level",
        "Mid Level",
        "Senior Level",
        "Executive",
        "Fresher",
      ],
    },
    jobRole: {
      type: String,
      trim: true,
      maxlength: [100, "Job role cannot exceed 100 characters"],
      default: function () {
        return this.title;
      },
    },
    applicationDeadline: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicationCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [30, "Tag cannot exceed 30 characters"],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for checking if application deadline has passed
jobSchema.virtual("isExpired").get(function () {
  return this.applicationDeadline < new Date();
});

// Virtual for formatted salary range
jobSchema.virtual("formattedSalary").get(function () {
  if (!this.salary.min && !this.salary.max) return "Competitive";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: this.salary.currency || "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (this.salary.min && this.salary.max) {
    return `${formatter.format(this.salary.min)} - ${formatter.format(this.salary.max)}`;
  } else if (this.salary.min) {
    return `${formatter.format(this.salary.min)}+`;
  } else if (this.salary.max) {
    return `Up to ${formatter.format(this.salary.max)}`;
  }

  return "Competitive";
});

// Index for better search performance
jobSchema.index({ title: "text", description: "text", requirements: "text" });
jobSchema.index({ category: 1, isActive: 1 });
jobSchema.index({ location: 1, type: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ applicationDeadline: 1 });

// Pre-save middleware to ensure application deadline is in the future
jobSchema.pre("save", function (next) {
  if (this.applicationDeadline && this.applicationDeadline < new Date()) {
    this.isActive = false;
  }
  next();
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
