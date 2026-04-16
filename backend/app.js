import express from "express";
import dbConnection from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
config({ path: "./config/config.env" });

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increased for development
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes" }
});
app.use(["/api", "/"], limiter);

const frontendOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim()) 
  : "http://localhost:5173";

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow if there's no origin (like mobile apps/postman), if it matches FRONTEND_URL, or if it's hosted natively on Vercel
      if (!origin || frontendOrigins.includes(origin) || origin.includes('vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Ensure DB is connected before processing any request (critical for serverless)
app.use(async (req, res, next) => {
  await dbConnection();
  next();
});

// Health check endpoint for debugging
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is alive!", timestamp: new Date().toISOString() });
});

// Diagnostic endpoint to test DB queries
app.get("/api/v1/test-db", async (req, res) => {
  try {
    const mongoose = await import("mongoose");
    const state = mongoose.default.connection.readyState;
    const stateNames = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
    
    // Try a simple query
    const collections = await mongoose.default.connection.db.listCollections().toArray();
    res.status(200).json({
      success: true,
      dbState: stateNames[state] || state,
      collections: collections.map(c => c.name),
      envCheck: {
        hasDBUrl: !!process.env.DB_URL,
        hasJwtKey: !!process.env.JWT_SECRET_KEY,
        hasCookieExpire: !!process.env.COOKIE_EXPIRE,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message, stack: error.stack });
  }
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/review", reviewRouter);

app.use(errorMiddleware);
export default app;
