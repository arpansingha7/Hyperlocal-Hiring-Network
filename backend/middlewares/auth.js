import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    // Gracefully handle the initial authentication check to avoid noisy 401 errors in logs
    if (req.originalUrl.includes("/getuser")) {
      return res.status(200).json({
        success: false,
        authenticated: false,
        message: "User not logged in"
      });
    }
    return next(new ErrorHandler("User Not Authorized", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorHandler("Session expired, please login again.", 401));
  }
});

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resource.`,
          403
        )
      );
    }
    next();
  };
};

export const isAdmin = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "Admin") {
    return next(new ErrorHandler("Access Denied: Admins Only", 403));
  }
  next();
});
