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
      trim: true,
      maxlength: [5000, "Job description cannot exceed 5000 characters"],
      default: "",
    },
    requirements: {
      type: String,
      trim: true,
      maxlength: [3000, "Job requirements cannot exceed 3000 characters"],
      default: "",
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
        default: "AED",
        enum: ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "AED"],
      },
    },
    category: {
      type: String,
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
      default: "Other",
    },
    experience: {
      type: String,
      enum: [
        "Entry Level",
        "Mid Level",
        "Senior Level",
        "Executive",
        "Fresher",
      ],
      default: "Entry Level",
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
    workLocationType: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      default: "On-site",
    },
    applicationMethod: {
      type: String,
      enum: ["Email", "Website", "Both"],
      default: "Email",
    },
    applicationEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})$/,
        "Please enter a valid email address",
      ],
    },
    applicationUrl: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.Mixed, // Can be ObjectId (for user reference) or string ("user" or "admin")
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
