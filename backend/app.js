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
import { sendEmail } from "./config/brevo.js";// if same level

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ... existing imports
const app = express();

// ✅ IMPORTANT: Use the port Render provides, or fallback to 5000 for local
const PORT = process.env.PORT || 5000;

// ✅ Ensure CORS allows your Vercel URL
app.use(cors({
  origin: ["http://localhost:3000", "https://finance-tracker1-tau.vercel.app"],
  credentials: true
}));

// ... routes setup

app.listen(PORT, () => {
  console.log(`✅ Server is live on port ${PORT}`);
});

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ===================== Middleware =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===================== File Upload Setup =====================
// Helper to ensure upload directories exist
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
app.use("/api/user", userRouter);
app.post("/api/user/upload-avatar", authUser, upload.single("avatar"), uploadAvatar);

const routesDir = path.join(__dirname, "routes");
for (const file of readdirSync(routesDir)) {
  if (!file.endsWith(".js") || file === "userRoutes.js") continue;
  const routeModule = await import(`./routes/${file}`);
  const router = routeModule.default || routeModule;
  app.use("/api/v1", router);
}

app.get("/", (req, res) => {
  res.send("🚀 Expense Tracker API is running successfully!");
});

// ===================== Server =====================
const startServer = async () => {
  try {
    await db();
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export { app, startServer };