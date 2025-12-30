import express from "express";  
import verifyToken from "../middlewares/auth.middleware.js";
import {employerOnly} from "../middlewares/role.middleware.js";          
import { appliedJob } from "../controllers/application.controller.js";
import { getMyApplications } from "../controllers/application.controller.js";

const router = express.Router();

router.post("/apply/:jobId",verifyToken,employerOnly,appliedJob);
router.get("/my",verifyToken,employerOnly,getMyApplications);

export default router;