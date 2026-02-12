import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import models
import User from "./models/User.js";

const fixAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/maplorix",
    );
    console.log("✅ MongoDB Connected");

    // Admin credentials
    const adminEmail = "maplorixae@gmail.com";
    const adminPassword = "maplorixDXB";

    console.log("🔧 Fixing admin password...");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);

    // Find admin user
    const adminUser = await User.findOne({ email: adminEmail });

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

    // Hash and set new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await User.updateOne(
      { email: adminEmail },
      {
        $set: {
          password: hashedPassword,
          isActive: true,
        },
      },
    );

    console.log("✅ Password updated successfully");

    // Verify the update
    const updatedUser = await User.findOne({ email: adminEmail }).select(
      "+password",
    );
    console.log(
      "🔐 New Password Hash:",
      updatedUser.password ? "Set" : "Not set",
    );

    // Test login
    const isPasswordValid = await bcrypt.compare(
      adminPassword,
      updatedUser.password,
    );
    console.log("🔐 Login Test:", isPasswordValid ? "✅ Success" : "❌ Failed");

    if (isPasswordValid) {
      console.log("\n🎉 Admin user is ready for login!");
      console.log("\n📋 Login Credentials:");
      console.log("  Email:", adminEmail);
      console.log("  Password:", adminPassword);
      console.log("  Role:", adminUser.role);
      console.log("\n🌐 Test with Postman:");
      console.log("  POST http://localhost:4000/api/auth/login");
      console.log("  Content-Type: application/json");
      console.log(
        "  Body:",
        JSON.stringify({
          email: adminEmail,
          password: adminPassword,
        }),
      );
    }
  } catch (error) {
    console.error("❌ Error fixing admin password:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
};

// Run the fix
fixAdminPassword();
