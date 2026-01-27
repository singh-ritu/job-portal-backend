import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { employerOnly } from "../middlewares/role.middleware.js";
import { getMyProfile, updateProfile } from "../controllers/employer.controller.js";


const router = express.Router();

router.get("/my", verifyToken, employerOnly, getMyProfile)
router.put("/profile", verifyToken, employerOnly, updateProfile)

export default router