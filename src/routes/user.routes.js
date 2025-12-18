import express from "express";
import verifyToken from "../middlewares/auth.middleware";
import employerOnly from "../middlewares/role.middleware";


const router = express.Router();

router.put("/profile",verifyToken,employerOnly,updateProfile)