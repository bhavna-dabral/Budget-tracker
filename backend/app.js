import 'dotenv/config';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { readdirSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./db/db.js";
import userRouter from "./routes/userRoutes.js";
import multer from "multer";
import { uploadAvatar } from "./controllers/userController.js";
import authUser from "./middleware/authUser.js";

// Initialize dotenv for safety (though 'dotenv/config' handles it)
dotenv.config();

const app = express();

/** * PORT CONFIGURATION
 * Render provides the port via process.env.PORT. 
 * We fallback to 5000 for local development.
 */
const PORT = process.env.PORT || 5000;

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===================== Security & CORS =====================
// ===================== Security & CORS =====================
const allowedOrigins = [
  "https://budget-tracker-3rch.vercel.app",       // 🆕 Added from your screenshot
  "https://budget-tracker-kohl-seven.vercel.app", // Your main Vercel link
  "http://localhost:5173",                        // Local Vite
  "http://localhost:3000"                         // Local Alternative
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps) or if it's in our allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS Blocked for origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Essential for the "Preflight" requests seen in your console// Handle pre-flight requests

// ===================== Global Middleware =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===================== File Upload Setup =====================
const uploadDir = path.join(__dirname, "uploads/avatars");
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ===================== Routes =====================

// Explicitly defined routes
app.use("/api/user", userRouter);
app.post("/api/user/upload-avatar", authUser, upload.single("avatar"), uploadAvatar);

// Auto-load other route files from the /routes directory
const routesDir = path.join(__dirname, "routes");
if (existsSync(routesDir)) {
  const files = readdirSync(routesDir);
  for (const file of files) {
    // Avoid re-importing userRoutes.js since it's already used above
    if (!file.endsWith(".js") || file === "userRoutes.js") continue;
    
    const routePath = `./routes/${file}`;
    const routeModule = await import(routePath);
    const router = routeModule.default || routeModule;
    app.use("/api/v1", router);
  }
}

// Health Check
app.get("/", (req, res) => {
  res.send("🚀 Expense Tracker API is running successfully!");
});

// ===================== Server Execution =====================
const startServer = async () => {
  try {
    // 1. Connect to Database first
    await db();
    
    // 2. Start listening only after DB connection is successful
    app.listen(PORT, () => {
      console.log(`✅ Server is live on port ${PORT}`);
      console.log(`🌐 Accepting requests from: ${allowedOrigins.join(", ")}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed. Server not started:", err);
    process.exit(1);
  }
};

// Protect against running server during automated tests
if (process.env.NODE_ENV !== "test") {
  startServer();
}

export { app, startServer };