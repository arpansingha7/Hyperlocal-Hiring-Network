import express from "express";
import {
  deleteJob,
  getAllJobs,
  getMyJobs,
  getSingleJob,
  postJob,
  updateJob,
  getJobsWithinRadius
} from "../controllers/jobController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall", getAllJobs);
router.get("/radius/:radius/center/:lat,:lng", getJobsWithinRadius);
router.post("/post", isAuthenticated, isAuthorized("Employer"), postJob);
router.get("/getmyjobs", isAuthenticated, isAuthorized("Employer"), getMyJobs);
router.put("/update/:id", isAuthenticated, isAuthorized("Employer"), updateJob);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Employer"), deleteJob);
router.get("/:id", getSingleJob);

export default router;
