import express from "express";  
import verifyToken from "../middlewares/auth.middleware";
import employerOnly from "../middlewares/role.middleware";          
import { appliedJob } from "../controllers/application.controller";
import { getMyApplications } from "../controllers/application.controller";

const router = express.Router();

router.post("/apply/:jobId",verifyToken,employerOnly,appliedJob);
router.get("/my",verifyToken,employerOnly,getMyApplications);