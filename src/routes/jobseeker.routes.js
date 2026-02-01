import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { jobSeekerOnly } from "../middlewares/role.middleware.js";
import { updateProfile, getMyProfile } from "../controllers/jobseeker.controller.js";


const router = express.Router();

router.get("/my", verifyToken, jobSeekerOnly, getMyProfile)
router.put("/profile", verifyToken, jobSeekerOnly, updateProfile)


export default router;