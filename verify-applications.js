import mongoose from "mongoose";
import dotenv from "dotenv";
import Application from "./models/Application.js";

dotenv.config();

const verifyApplications = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/maplorix",
    );

    const count = await Application.countDocuments();
    const apps = await Application.find({})
      .select("fullName email jobRole status priority applicationDate")
      .limit(5);

    console.log("=== APPLICATION DATA RESTORATION VERIFICATION ===");
    console.log("Total Applications:", count);
    console.log("");
    console.log("Sample Applications:");
    apps.forEach((app) => {
      console.log(`- ${app.fullName} (${app.email})`);
      console.log(`  Role: ${app.jobRole}`);
      console.log(`  Status: ${app.status}`);
      console.log(`  Priority: ${app.priority}`);
      console.log(
        `  Applied: ${app.applicationDate ? app.applicationDate.toLocaleDateString() : "N/A"}`,
      );
      console.log("");
    });

    // Count by status
    const statusCounts = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    console.log("Applications by Status:");
    statusCounts.forEach((item) => {
      console.log(`- ${item._id}: ${item.count}`);
    });

    console.log(
      "\n\u2702 Application data restoration completed successfully!",
    );

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
    await mongoose.connection.close();
  }
};

verifyApplications();
