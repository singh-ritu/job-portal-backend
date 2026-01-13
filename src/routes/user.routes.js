import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import {employerOnly, jobSeekerOnly} from "../middlewares/role.middleware.js";
import { updateProfile, getMyProfile } from "../controllers/user.controller.js";


const router = express.Router();

router.get("/my",verifyToken, getMyProfile)
router.put("/profile",verifyToken,jobSeekerOnly,updateProfile)


export default router;