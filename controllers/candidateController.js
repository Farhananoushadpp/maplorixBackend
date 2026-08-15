import Candidate from "../models/Candidate.js";
import path from "path";
import fs from "fs";

// GET /api/candidates
export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: candidates.length,
      candidates,
    });
  } catch (error) {
    console.error("Fetch Candidates Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/candidates
export const createCandidate = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobile,
      phone,
      nationality,
      currentlyLocated,
      visaStatus,
      industry,
    } = req.body;

    if (!email || !firstName) {
      return res.status(400).json({
        success: false,
        message: "First Name and Email are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = (mobile || phone || "").trim();
    const cleanFirstName = firstName.trim();
    const cleanLastName = (lastName || "").trim();

    let cvFile = "";
    let originalName = "";

    if (req.file) {
      cvFile = req.file.filename;
      originalName = req.file.originalname;
    } else if (req.files) {
      const f =
        (req.files.attachedCv && req.files.attachedCv[0]) ||
        (req.files.resume && req.files.resume[0]);
      if (f) {
        cvFile = f.filename;
        originalName = f.originalname;
      }
    }

    if (!cvFile) {
      cvFile = req.body.attachedCvName || req.body.attachedCv || req.body.resume || "";
      originalName = cvFile;
    }

    // Upsert / Update if candidate exists with this email
    const candidateData = {
      firstName: cleanFirstName,
      lastName: cleanLastName,
      fullName: `${cleanFirstName} ${cleanLastName}`.trim(),
      email: cleanEmail,
      mobile: cleanMobile,
      phone: cleanMobile,
      nationality: nationality || "Not specified",
      currentlyLocated: currentlyLocated || "Not specified",
      visaStatus: visaStatus || "",
      industry: industry || "General Profile",
    };

    if (cvFile) {
      candidateData.attachedCv = cvFile;
      candidateData.resume = cvFile;
      candidateData.originalCvName = originalName;
    }

    const candidate = await Candidate.findOneAndUpdate(
      { email: cleanEmail },
      { $set: candidateData },
      { new: true, upsert: true }
    );

    return res.status(201).json({
      success: true,
      message: "Candidate profile saved successfully",
      candidate,
    });
  } catch (error) {
    console.error("Create Candidate Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/candidates/:id
export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Candidate deleted successfully" });
  } catch (error) {
    console.error("Delete Candidate Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
