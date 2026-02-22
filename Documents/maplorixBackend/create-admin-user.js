import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import models
import User from "./models/User.js";
import Contact from "./models/Contact.js";

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/maplorix",
    );
    console.log("✅ MongoDB Connected");

    // Admin credentials
    const adminData = {
      firstName: "maplorix",
      lastName: "Company",
      email: "maplorixae@gmail.com",
      password: "maplorixDXB",
      phone: "+971525299961",
      role: "admin",
      department: "General",
      isActive: true,
    };

    console.log("🔍 Checking if admin user already exists...");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists. Updating...");

      // Update existing admin
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      await User.updateOne(
        { email: adminData.email },
        {
          $set: {
            firstName: adminData.firstName,
            lastName: adminData.lastName,
            password: hashedPassword,
            phone: adminData.phone,
            role: adminData.role,
            department: adminData.department,
            isActive: adminData.isActive,
            permissions: [],
            profile: {
              avatar: null,
              bio: "",
              location: "",
              website: "",
              socialLinks: {},
            },
          },
        },
      );

      console.log("✅ Admin user updated successfully");
    } else {
      console.log("👤 Creating new admin user...");

      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      // Create contact
      const contact = new Contact({
        name: `${adminData.firstName} ${adminData.lastName}`,
        email: adminData.email,
        phone: adminData.phone,
        subject: "Admin User Registration",
        message: "Admin user account created for Maplorix Company",
        category: "general",
        status: "resolved",
      });

      await contact.save();
      console.log("✅ Contact created:", contact._id);

      // Create admin user
      const adminUser = new User({
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        email: adminData.email,
        password: hashedPassword,
        phone: adminData.phone,
        role: adminData.role,
        department: adminData.department,
        isActive: adminData.isActive,
        permissions: [],
        profile: {
          avatar: null,
          bio: "",
          location: "",
          website: "",
          socialLinks: {},
        },
      });

      await adminUser.save();
      console.log("✅ Admin user created:", adminUser._id);
    }

    // Verify admin user
    const adminUser = await User.findOne({ email: adminData.email });
    console.log("🔍 Admin User Details:");
    console.log("  Name:", adminUser.fullName);
    console.log("  Email:", adminUser.email);
    console.log("  Role:", adminUser.role);
    console.log("  Department:", adminUser.department);
    console.log("  Phone:", adminUser.phone);
    console.log("  Active:", adminUser.isActive);
    console.log("  Created:", adminUser.createdAt);

    console.log("\n🎉 Admin user setup completed successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("  Email:", adminData.email);
    console.log("  Password:", adminData.password);
    console.log("  Role:", adminData.role);
    console.log("\n🌐 You can now login with these credentials.");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
};

// Run the script
createAdminUser();
