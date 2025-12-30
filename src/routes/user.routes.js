import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import {employerOnly} from "../middlewares/role.middleware.js";


const router = express.Router();

// router.put("/profile",verifyToken,employerOnly,updateProfile)

export default router;