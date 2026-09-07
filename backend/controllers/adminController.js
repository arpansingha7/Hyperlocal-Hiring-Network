import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import { Job } from "../models/jobSchema.js";
import { Application } from "../models/applicationSchema.js";
import ErrorHandler from "../middlewares/error.js";

// Enhanced stats for charts
export const getPlatformStats = catchAsyncErrors(async (req, res, next) => {
    const totalUsers = await User.countDocuments();
    const employers = await User.countDocuments({ role: "Employer" });
    const jobSeekers = await User.countDocuments({ role: "Job Seeker" });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ expired: false });
    const totalApplications = await Application.countDocuments();
    const hires = await Application.countDocuments({ status: "Hired" });

    // Monthly sign-up trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const rawGrowth = await User.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const userGrowth = rawGrowth.map(item => ({
        _id: monthNames[item._id.month] || `M${item._id.month}`,
        count: item.count
    }));

    // Job category distribution
    const categoryDistribution = await Job.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 }
    ]);

    res.status(200).json({
        success: true,
        stats: {
            totalUsers,
            employers,
            jobSeekers,
            totalJobs,
            activeJobs,
            totalApplications,
            hires,
            userGrowth,
            categoryDistribution
        }
    });
});

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find().select("-password -otpHash");
    res.status(200).json({ success: true, users });
});

export const toggleUserStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler("User not found", 404));

    if (user.role === "Admin") {
        return next(new ErrorHandler("Cannot deactivate an Admin account", 403));
    }

    user.isAccountActive = !user.isAccountActive;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: `Account has been ${user.isAccountActive ? "Activated" : "Suspended"}`,
        isAccountActive: user.isAccountActive
    });
});

export const verifyUser = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler("User not found", 404));

    user.isVerified = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "User identity verified successfully",
        isVerified: user.isVerified
    });
});

export const getAllJobsAdmin = catchAsyncErrors(async (req, res, next) => {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
});

export const deleteJobByAdmin = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) return next(new ErrorHandler("Job not found", 404));

    await job.deleteOne();
    res.status(200).json({
        success: true,
        message: "Job deleted by administrator moderation."
    });
});
