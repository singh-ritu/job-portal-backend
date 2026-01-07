import express from "express";
import { uploadResume } from "../middlewares/resumeUpload.middleware.js";
import verifyToken from "../middlewares/auth.middleware.js";
import {jobSeekerOnly} from "../middlewares/role.middleware.js";
import { uploadResumeController } from "../controllers/upload.controller.js";


const router = express.Router();

router.post(
  "/resume",
  verifyToken,
  jobSeekerOnly,
  uploadResume.single("resume"),
  uploadResumeController
);

export default router;
