import express from "express";  
import verifyToken from "../middlewares/auth.middleware.js";
import {jobSeekerOnly} from "../middlewares/role.middleware.js";          
import { appliedJob } from "../controllers/application.controller.js";
import { getMyApplications } from "../controllers/application.controller.js";

const router = express.Router();

router.post("/apply/:jobId",verifyToken,jobSeekerOnly,appliedJob);
router.get("/my",verifyToken,getMyApplications);

export default router;