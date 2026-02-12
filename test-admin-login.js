import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import models
import User from "./models/User.js";

const testAdminLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/maplorix",
    );
    console.log("✅ MongoDB Connected");

    // Test credentials
    const testEmail = "maplorixae@gmail.com";
    const testPassword = "maplorixDXB";

    console.log("🔍 Testing admin login...");
    console.log("Email:", testEmail);
    console.log("Password:", testPassword);

    // Find admin user
    const adminUser = await User.findOne({ email: testEmail });

    if (!adminUser) {
      console.log("❌ Admin user not found");
      return;
    }

    console.log("👤 Admin User Found:");
    console.log("  Name:", adminUser.fullName);
    console.log("  Email:", adminUser.email);
    console.log("  Role:", adminUser.role);
    console.log("  Department:", adminUser.department);
    console.log("  Active:", adminUser.isActive);
    console.log("  Created:", adminUser.createdAt);

    // Test password comparison
    console.log("🔐 Stored Password Hash:", adminUser.password);
    console.log("🔐 Testing Password:", testPassword);

    if (!adminUser.password) {
      console.log("❌ Password field is empty");
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      testPassword,
      adminUser.password,
    );
    console.log("🔐 Password Valid:", isPasswordValid);

    if (isPasswordValid) {
      console.log("✅ Login credentials are correct!");
    } else {
      console.log("❌ Password is incorrect");

      // Reset password
      console.log("🔄 Resetting admin password...");
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(testPassword, salt);

      await User.updateOne(
        { email: testEmail },
        { $set: { password: hashedPassword } },
      );

      console.log("✅ Password reset successfully");

      // Test again
      const updatedUser = await User.findOne({ email: testEmail });
      const isResetPasswordValid = await bcrypt.compare(
        testPassword,
        updatedUser.password,
      );
      console.log("🔐 Reset Password Valid:", isResetPasswordValid);
    }
  } catch (error) {
    console.error("❌ Error testing admin login:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
};

// Run the test
testAdminLogin();
