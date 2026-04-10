import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load production environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load production environment variables
dotenv.config({ path: join(__dirname, ".env.production") });

console.log("🚀 Starting Maplorix Backend Deployment...");
console.log(`📊 Environment: ${process.env.NODE_ENV || "production"}`);
console.log(`🌐 Port: ${process.env.PORT || 4000}`);
console.log(
  `🗄️ Database: ${process.env.MONGODB_URI ? "Configured" : "Not configured"}`,
);

// Validate required environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET", "PORT"];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error(
    "\nPlease configure your .env.production file before deploying.",
  );
  process.exit(1);
}

console.log("✅ Environment validation passed!");

// Import and start the server
try {
  console.log("🔄 Starting server...");

  // Dynamic import to ensure env vars are loaded first
  const { default: app } = await import("./server.js");

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, "0.0.0.0", () => {
    console.log("🎉 Server successfully deployed!");
    console.log(`🌐 Server running on: http://0.0.0.0:${PORT}`);
    console.log(`🏥 Health check: http://0.0.0.0:${PORT}/health`);
    console.log(`📚 API Documentation: http://0.0.0.0:${PORT}/api`);

    console.log("\n📋 Available Endpoints:");
    console.log("   🔐 Authentication:");
    console.log("      POST /api/auth/register");
    console.log("      POST /api/auth/login");
    console.log("      GET  /api/auth/profile");
    console.log("   📄 Pages Access:");
    console.log("      GET  /api/pages/navigation");
    console.log("      GET  /api/pages/access/:pageName");
    console.log("      GET  /api/pages/public");
    console.log("   💼 Jobs:");
    console.log("      GET  /api/jobs");
    console.log("      POST /api/jobs");
    console.log("   📞 Contact:");
    console.log("      POST /api/contacts");
    console.log("   📝 Applications:");
    console.log("      GET  /api/applications");
    console.log("      POST /api/applications");
    console.log("   👑 Admin:");
    console.log("      GET  /api/admin/dashboard");
    console.log("      GET  /api/admin/posts");

    console.log("\n🔐 Role-Based Access:");
    console.log("   👤 User Pages: Home, About Us, Feed, Contact Us");
    console.log(
      "   👨‍💼 Admin Pages: Home, About Us, Feed, Dashboard, Admin Posts, Contact Us",
    );
    console.log(
      "   🏢 HR/Recruiter/Manager: Home, About Us, Feed, Dashboard, Contact Us",
    );

    console.log("\n✅ Deployment complete! Your website is ready for hosting.");
  });
} catch (error) {
  console.error("❌ Failed to start server:", error.message);
  process.exit(1);
}
