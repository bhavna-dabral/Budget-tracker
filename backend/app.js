import "dotenv/config";
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

dotenv.config();

const app = express();

/** =====================
 * PORT
 * ===================== */
const PORT = process.env.PORT || 5000;

/** =====================
 * __dirname fix (ES Modules)
 * ===================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** =====================
 * CORS (FIXED FOR VERCEL + RENDER)
 * ===================== */
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ CORS blocked:", origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());
/** =====================
 * GLOBAL MIDDLEWARE
 * ===================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** =====================
 * STATIC FILES
 * ===================== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/** =====================
 * FILE UPLOAD (MULTER)
 * ===================== */
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

/** =====================
 * ROUTES
 * ===================== */
app.use("/api/user", userRouter);

app.post(
  "/api/user/upload-avatar",
  authUser,
  upload.single("avatar"),
  uploadAvatar
);

/** =====================
 * AUTO ROUTE LOADER
 * ===================== */
const routesDir = path.join(__dirname, "routes");

if (existsSync(routesDir)) {
  const files = readdirSync(routesDir);

  for (const file of files) {
    if (!file.endsWith(".js") || file === "userRoutes.js") continue;

    const routeModule = await import(`./routes/${file}`);
    const router = routeModule.default || routeModule;

    app.use("/api/v1", router);
  }
}

/** =====================
 * HEALTH CHECK
 * ===================== */
app.get("/", (req, res) => {
  res.send("🚀 Expense Tracker API is running successfully!");
});

/** =====================
 * START SERVER
 * ===================== */
const startServer = async () => {
  try {
    await db();

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Allowed origins: ${allowedOrigins.join(", ")}`);
    });
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export { app, startServer };