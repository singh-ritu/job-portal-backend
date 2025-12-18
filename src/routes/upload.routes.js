import express from "express";
import uploadResume from "../middlewares/resumeUpload.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import jobSeekerOnly from "../middlewares/jobSeekerOnly.js";
import { uploadResumeController } from "../controllers/upload.controller.js";

const router = express.Router();

router.post(
  "/resume",
  authMiddleware,
  jobSeekerOnly,
  uploadResume.single("resume"),
  uploadResumeController
);

export default router;
