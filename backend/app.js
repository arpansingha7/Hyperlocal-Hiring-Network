import express from "express";
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
import mongoose from "mongoose";
import dbConnection from "./database/dbConnection.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
config({ path: path.resolve(__dirname, "config", "config.env") });

app.use(helmet());
app.set("trust proxy", 1);

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
  : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"];

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


// Ensure database connection for serverless / Vercel functions
app.use(async (req, res, next) => {
  try {
    await dbConnection();
    next();
  } catch (err) {
    console.error("Database connection error in request:", err.message);
    next(err);
  }
});

// Health check endpoint for Vercel / deployment verification
app.get(["/api", "/api/v1", "/api/health", "/health"], (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hyperlocal Hiring Network API is running successfully.",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use(["/api/v1/user", "/v1/user", "/user"], userRouter);
app.use(["/api/v1/job", "/v1/job", "/job"], jobRouter);
app.use(["/api/v1/application", "/v1/application", "/application"], applicationRouter);
app.use(["/api/v1/admin", "/v1/admin", "/admin"], adminRouter);
app.use(["/api/v1/review", "/v1/review", "/review"], reviewRouter);

app.use(errorMiddleware);
export default app;
