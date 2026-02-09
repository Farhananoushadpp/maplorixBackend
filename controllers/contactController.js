import { validationResult } from "express-validator";
import Contact from "../models/Contact.js";
import { sendContactEmail } from "../services/emailService.js";

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation Error",
      message: errors
        .array()
        .map((err) => err.msg)
        .join(", "),
    });
  }
  next();
};

// Submit contact form
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message, category, priority } =
      req.body;

    // Create contact submission
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      category: category || "general",
      priority: priority || "medium",
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    await contact.save();

    // Send email notification (async, don't wait for it)
    sendContactEmail(contact).catch((error) => {
      console.error("Error sending contact email:", error);
    });

    res.status(201).json({
      success: true,
      message:
        "Your message has been sent successfully. We will get back to you soon.",
      data: {
        contact: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          category: contact.category,
          priority: contact.priority,
          status: contact.status,
          createdAt: contact.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Error submitting contact:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to submit contact form",
    });
  }
};

// Get all contacts with filtering and pagination
export const getAllContacts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      category,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { subject: new RegExp(search, "i") },
        { message: new RegExp(search, "i") },
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Contact.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to fetch contacts",
    });
  }
};

// Get single contact by ID
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid contact ID format",
      });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        error: "Not Found",
        message: "Contact not found",
      });
    }

    res.json({
      success: true,
      data: {
        contact,
      },
    });
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to fetch contact",
    });
  }
};

// Update contact
export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid contact ID format",
      });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        error: "Not Found",
        message: "Contact not found",
      });
    }

    // Update contact
    const allowedUpdates = ["status", "priority", "category", "notes"];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(contact, updates);
    await contact.save();

    res.json({
      success: true,
      message: "Contact updated successfully",
      data: {
        contact,
      },
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to update contact",
    });
  }
};

// Add note to contact
export const addContactNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid contact ID format",
      });
    }

    if (!note || note.trim().length === 0) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Note content is required",
      });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        error: "Not Found",
        message: "Contact not found",
      });
    }

    // Add note
    contact.notes.push({
      content: note.trim(),
      addedBy: req.user._id,
      addedAt: new Date(),
    });

    await contact.save();

    res.json({
      success: true,
      message: "Note added successfully",
      data: {
        contact,
      },
    });
  } catch (error) {
    console.error("Error adding contact note:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to add note",
    });
  }
};

// Delete contact
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid contact ID format",
      });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        error: "Not Found",
        message: "Contact not found",
      });
    }

    await Contact.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to delete contact",
    });
  }
};

// Get contact statistics
export const getContactStats = async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: null,
          totalContacts: { $sum: 1 },
          pendingContacts: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          inProgressContacts: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
          },
          resolvedContacts: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
          },
        },
      },
    ]);

    const priorityStats = await Contact.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const categoryStats = await Contact.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const result = stats[0] || {
      totalContacts: 0,
      pendingContacts: 0,
      inProgressContacts: 0,
      resolvedContacts: 0,
    };

    res.json({
      success: true,
      data: {
        ...result,
        priorityStats,
        categoryStats,
      },
    });
  } catch (error) {
    console.error("Error fetching contact statistics:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to fetch contact statistics",
    });
  }
};

export { handleValidationErrors };
