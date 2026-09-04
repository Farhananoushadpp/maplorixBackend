import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function deduplicateDatabase() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const Application = mongoose.model(
    "Application",
    new mongoose.Schema({}, { strict: false })
  );
  const Job = mongoose.model("Job", new mongoose.Schema({}, { strict: false }));

  const allApps = await Application.find({}).sort({ createdAt: 1 }).lean();
  console.log("Total applications before cleanup:", allApps.length);

  const seen = new Set();
  const toKeepIds = new Set();
  const toDelete = [];

  for (const app of allApps) {
    const email = (app.email || "").trim().toLowerCase();
    const rawMobile = app.mobile || app.phone || "";
    const cleanMobile = rawMobile.trim().replace(/\s+/g, "");
    const jobKey = app.job ? String(app.job) : "general";

    const isGenericPhone = ["9876543210", "1234567890"].includes(cleanMobile);

    const emailKey = email ? email + "___" + jobKey : null;
    const phoneKey =
      !isGenericPhone && cleanMobile ? cleanMobile + "___" + jobKey : null;

    let isDuplicate = false;
    if (emailKey && seen.has("email:" + emailKey)) {
      isDuplicate = true;
    }
    if (phoneKey && seen.has("phone:" + phoneKey)) {
      isDuplicate = true;
    }

    if (isDuplicate) {
      toDelete.push(app);
    } else {
      if (emailKey) seen.add("email:" + emailKey);
      if (phoneKey) seen.add("phone:" + phoneKey);
      toKeepIds.add(String(app._id));
    }
  }

  console.log("Unique applications to keep:", toKeepIds.size);
  console.log("Duplicate applications to delete:", toDelete.length);

  // Collect paths of files kept
  const keptIdArray = Array.from(toKeepIds);
  const keptApps = await Application.find({ _id: { $in: keptIdArray } }).lean();
  const keptFilePaths = new Set();
  for (const app of keptApps) {
    if (app.attachedCv?.path) keptFilePaths.add(app.attachedCv.path);
    if (app.resume?.path) keptFilePaths.add(app.resume.path);
  }

  // Delete duplicates from DB
  const deleteIds = toDelete.map((a) => a._id);
  const deleteResult = await Application.deleteMany({ _id: { $in: deleteIds } });
  console.log("Successfully deleted duplicate documents from DB:", deleteResult.deletedCount);

  // Clean up duplicate orphaned files
  let deletedFiles = 0;
  for (const app of toDelete) {
    const filePath = app.attachedCv?.path || app.resume?.path;
    if (filePath && !keptFilePaths.has(filePath)) {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          deletedFiles++;
        }
      } catch (e) {
        console.warn("Could not delete duplicate file:", filePath, e.message);
      }
    }
  }
  console.log("Cleaned up orphaned duplicate files:", deletedFiles);

  // Recalculate applicationCount for all jobs
  const jobs = await Job.find({}).lean();
  for (const j of jobs) {
    const count = await Application.countDocuments({ job: j._id });
    await Job.findByIdAndUpdate(j._id, { applicationCount: count });
  }
  console.log("Updated job application counts.");

  const remaining = await Application.countDocuments();
  console.log("Total applications in DB now:", remaining);

  await mongoose.disconnect();
}

deduplicateDatabase().catch((err) => {
  console.error("Deduplication error:", err);
  process.exit(1);
});
