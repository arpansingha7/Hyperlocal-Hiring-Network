import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import axios from "axios";
import { io } from "../server.js";

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer not allowed to access this resource.", 400)
    );
  }

  const { name, email, coverLetter, phone, address, jobId } = req.body;
  const applicantID = {
    user: req.user._id,
    role: "Job Seeker",
  };
  if (!jobId) {
    return next(new ErrorHandler("Job not found!", 404));
  }
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  const employerID = {
    user: jobDetails.postedBy,
    role: "Employer",
  };
  if (!name || !email || !coverLetter || !phone || !address) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }

  // Duplicate Application Prevention (One-Tap constraint)
  const existingApplication = await Application.findOne({
    "applicantID.user": req.user._id,
    jobId: jobId
  });

  if (existingApplication) {
    return next(new ErrorHandler("You have already applied for this job.", 400));
  }

  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    jobId,
  });

  // Emit live socket.io notification to the employer
  if (io && typeof io.to === "function") {
    io.to(employerID.user.toString()).emit("new_application", {
      message: `New application received from ${name} for your recent job post!`,
      applicationId: application._id,
    });
  }

  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
});

export const employerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }

    // Ownership Check: Ensure the applicant is the one deleting their own application
    if (application.applicantID.user.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Unauthorized: You can only delete your own applications.", 403));
    }

    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);

export const aiGenerateCoverLetter = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(new ErrorHandler("Employer not allowed to access this resource.", 400));
  }

  const { jobId, userName, skills } = req.body;
  if (!jobId) {
    return next(new ErrorHandler("Job ID is required.", 400));
  }

  const job = await Job.findById(jobId);
  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  const prompt = `Write a professional, concise, and modern cover letter for the position of "${job.title}" in the "${job.category}" industry. The applicant's name is ${userName || req.user.name || 'the applicant'}. They have the following skills: ${skills || 'relevant skills that make me a great fit for this position'}. Make it highly convincing but under 200 words. Do not use [Brackets] for anything, write a generic company name if needed or omit it entirely. End with Sincerely, ${userName || req.user.name || 'Applicant'}.`;

  const applicant = userName || req.user?.name || 'Applicant';

  if (!process.env.GROQ_API_KEY) {
    const fallbackCoverLetter = `Dear Hiring Team,\n\nI am enthusiastic about applying for the position of ${job.title}. With a strong background in ${skills || 'the required qualifications'} and familiarity with ${job.category}, I am confident in my capability to make an immediate, meaningful contribution to your operations in ${job.city}.\n\nMy attention to detail, reliability, and collaborative work ethic make me an ideal match for your team. I look forward to the possibility of discussing this opportunity further.\n\nSincerely,\n${applicant}`;

    return res.status(200).json({
      success: true,
      coverLetter: fallbackCoverLetter,
    });
  }

  try {
    const groqRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({
      success: true,
      coverLetter: groqRes.data.choices[0].message.content,
    });
  } catch (error) {
    console.warn("Groq API error, using fallback cover letter:", error.response?.data || error.message);
    const fallbackCoverLetter = `Dear Hiring Team,\n\nI am writing to express my strong interest in the ${job.title} role. With proven experience in ${skills || 'core industry responsibilities'} across the ${job.category} space, I am well-prepared to deliver high-quality results for your team.\n\nThank you for considering my application. I look forward to speaking with you soon.\n\nSincerely,\n${applicant}`;

    res.status(200).json({
      success: true,
      coverLetter: fallbackCoverLetter,
    });
  }
});

export const updateApplicationStatus = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(new ErrorHandler("Job Seeker not allowed to access this resource.", 400));
  }

  const { id } = req.params;
  const { status } = req.body;

  let application = await Application.findById(id);
  if (!application) {
    return next(new ErrorHandler("Application not found!", 404));
  }

  // Ownership Check: Ensure the employer is the owner of the job being applied for
  if (application.employerID.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized: You can only manage applications for your own job listings.", 403));
  }

  application.status = status;
  await application.save();

  // Optionally emit socket event to applicant
  if (io && typeof io.to === "function") {
    io.to(application.applicantID.user.toString()).emit("application_status_update", {
      message: `Your application status was updated to ${status}!`,
      applicationId: application._id,
      status
    });
  }

  res.status(200).json({
    success: true,
    message: `Application marked as ${status}!`,
    application,
  });
});
