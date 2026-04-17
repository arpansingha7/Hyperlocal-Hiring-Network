import express from "express";
import { 
    getPlatformStats, 
    getAllUsers, 
    toggleUserStatus, 
    verifyUser, 
    getAllJobsAdmin, 
    deleteJobByAdmin 
} from "../controllers/adminController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

// All routes require authentication and Admin role
router.use(isAuthenticated);
router.use(isAuthorized("Admin"));

router.get("/stats", getPlatformStats);
router.get("/users", getAllUsers);
router.put("/user/status/:id", toggleUserStatus);
router.put("/user/verify/:id", verifyUser);
router.get("/jobs", getAllJobsAdmin);
router.delete("/job/:id", deleteJobByAdmin);

export default router;
