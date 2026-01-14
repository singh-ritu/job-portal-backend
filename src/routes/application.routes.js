import express from "express";  
import verifyToken from "../middlewares/auth.middleware.js";
import {jobSeekerOnly, employerOnly} from "../middlewares/role.middleware.js";    
import { getApplicantsByJob } from "../controllers/application.controller.js";      

import {getMyApplications, appliedJob} from "../controllers/application.controller.js";


const router = express.Router();

router.post("/apply/:jobId",verifyToken,jobSeekerOnly,appliedJob);
router.get("/my",verifyToken,getMyApplications);

router.get( "/:jobId/applicants",verifyToken,employerOnly,getApplicantsByJob);

export default router;