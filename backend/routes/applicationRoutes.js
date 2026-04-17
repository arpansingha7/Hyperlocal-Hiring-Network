import express from "express";
import {
  employerGetAllApplications,
  jobseekerDeleteApplication,
  jobseekerGetAllApplications,
  postApplication,
  aiGenerateCoverLetter,
  updateApplicationStatus
} from "../controllers/applicationController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isAuthenticated, isAuthorized("Job Seeker"), postApplication);
router.get("/employer/getall", isAuthenticated, isAuthorized("Employer"), employerGetAllApplications);
router.get("/jobseeker/getall", isAuthenticated, isAuthorized("Job Seeker"), jobseekerGetAllApplications);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Job Seeker"), jobseekerDeleteApplication);
router.post("/ai-generate-cover-letter", isAuthenticated, isAuthorized("Job Seeker"), aiGenerateCoverLetter);
router.put("/status/:id", isAuthenticated, isAuthorized("Employer"), updateApplicationStatus);

export default router;
