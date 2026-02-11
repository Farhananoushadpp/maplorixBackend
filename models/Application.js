import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // Personal Information
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },

    // Professional Information
    jobRole: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
      maxlength: [100, "Job role cannot exceed 100 characters"],
    },
    experience: {
      type: String,
      required: [true, "Experience level is required"],
      enum: [
        "fresher",
        "1-3",
        "3-5",
        "5+",
        "10+",
        "Entry Level",
        "Mid Level",
        "Senior Level",
        "Executive",
      ],
    },
    skills: {
      type: String,
      trim: true,
      maxlength: [1000, "Skills cannot exceed 1000 characters"],
    },
    currentCompany: {
      type: String,
      trim: true,
      maxlength: [100, "Current company cannot exceed 100 characters"],
    },
    currentDesignation: {
      type: String,
      trim: true,
      maxlength: [100, "Current designation cannot exceed 100 characters"],
    },
    expectedSalary: {
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
    noticePeriod: {
      type: String,
      enum: [
        "immediate",
        "15 days",
        "30 days",
        "60 days",
        "90 days",
        "negotiable",
      ],
      default: "30 days",
    },

    // Job Information (optional)
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: false,
    },

    // Resume Information (optional)
    resume: {
      filename: {
        type: String,
        required: false,
      },
      originalName: {
        type: String,
        required: false,
      },
      mimetype: {
        type: String,
        required: false,
      },
      size: {
        type: Number,
        required: false,
      },
      path: {
        type: String,
        required: false,
      },
    },

    // Application Status
    status: {
      type: String,
      enum: [
        "submitted",
        "under-review",
        "shortlisted",
        "interview-scheduled",
        "interviewed",
        "rejected",
        "selected",
        "withdrawn",
      ],
      default: "submitted",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // Additional Information
    coverLetter: {
      type: String,
      trim: true,
      maxlength: [5000, "Cover letter cannot exceed 5000 characters"],
    },
    linkedinProfile: {
      type: String,
      trim: true,
      maxlength: [500, "LinkedIn profile URL cannot exceed 500 characters"],
    },
    portfolio: {
      type: String,
      trim: true,
      maxlength: [500, "Portfolio URL cannot exceed 500 characters"],
    },
    github: {
      type: String,
      trim: true,
      maxlength: [500, "GitHub profile URL cannot exceed 500 characters"],
    },
    website: {
      type: String,
      trim: true,
      maxlength: [500, "Website URL cannot exceed 500 characters"],
    },
    source: {
      type: String,
      enum: [
        "website",
        "linkedin",
        "referral",
        "job-board",
        "social-media",
        "employee-referral",
        "campus-drive",
        "walk-in",
        "other",
      ],
      default: "website",
    },

    // Additional Details
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
    },
    dateOfBirth: {
      type: Date,
    },
    nationality: {
      type: String,
      maxlength: [100, "Nationality cannot exceed 100 characters"],
    },
    workAuthorization: {
      type: String,
      enum: [
        "citizen",
        "permanent-resident",
        "work-permit",
        "student-visa",
        "tourist-visa",
        "other",
      ],
    },
    languages: [
      {
        language: String,
        proficiency: {
          type: String,
          enum: ["basic", "intermediate", "advanced", "native"],
        },
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        field: String,
        startYear: Number,
        endYear: Number,
        grade: String,
      },
    ],
    workHistory: [
      {
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        description: String,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        date: Date,
        expiryDate: Date,
        credentialId: String,
        credentialUrl: String,
      },
    ],
    references: [
      {
        name: String,
        position: String,
        company: String,
        email: String,
        phone: String,
        relationship: String,
      },
    ],
    availability: {
      type: String,
      enum: [
        "immediate",
        "1-week",
        "2-weeks",
        "1-month",
        "2-months",
        "3-months",
        "negotiable",
      ],
    },
    expectedStartDate: {
      type: Date,
    },
    salaryNegotiable: {
      type: Boolean,
      default: true,
    },
    relocation: {
      type: Boolean,
      default: false,
    },
    remoteWork: {
      type: Boolean,
      default: false,
    },

    // Review Information
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    reviewNotes: {
      type: String,
      maxlength: [1000, "Review notes cannot exceed 1000 characters"],
    },

    // Interview Information
    interviewDate: {
      type: Date,
    },
    interviewType: {
      type: String,
      enum: ["phone", "video", "in-person", "technical", "panel"],
    },
    interviewNotes: {
      type: String,
      maxlength: [1000, "Interview notes cannot exceed 1000 characters"],
    },

    // Communication
    emailsSent: [
      {
        type: {
          type: String,
          enum: [
            "confirmation",
            "review-update",
            "interview-schedule",
            "rejection",
            "offer",
            "other",
          ],
          required: true,
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
        subject: String,
        content: String,
      },
    ],

    // Metadata
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for time since application
applicationSchema.virtual("timeSinceApplication").get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return "Just now";
});

// Virtual for formatted expected salary
applicationSchema.virtual("formattedExpectedSalary").get(function () {
  if (!this.expectedSalary.min && !this.expectedSalary.max)
    return "Not specified";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: this.expectedSalary.currency || "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (this.expectedSalary.min && this.expectedSalary.max) {
    return `${formatter.format(this.expectedSalary.min)} - ${formatter.format(this.expectedSalary.max)}`;
  } else if (this.expectedSalary.min) {
    return `${formatter.format(this.expectedSalary.min)}+`;
  } else if (this.expectedSalary.max) {
    return `Up to ${formatter.format(this.expectedSalary.max)}`;
  }

  return "Not specified";
});

// Index for better search performance
applicationSchema.index({ email: 1 });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });
applicationSchema.index({ priority: 1, status: 1 });
applicationSchema.index({ experience: 1 });
applicationSchema.index({ skills: "text", jobRole: "text" });

// Pre-save middleware to update job application count
applicationSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const Job = mongoose.model("Job");
      await Job.findByIdAndUpdate(this.job, { $inc: { applicationCount: 1 } });
    } catch (error) {
      console.error("Error updating job application count:", error);
    }
  }
  next();
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;
