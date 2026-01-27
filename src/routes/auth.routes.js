import express from "express";
import passport from "passport";
import '../config/passport.js';
import { loginUser, registerUser, getMe, logoutUser } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { generateToken } from "../utils/jwt.js";
import User from "../models/user.model.js";
import Employer from "../models/employer.model.js";
import JobSeeker from "../models/jobSeeker.model.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", verifyToken, getMe);


router.post("/logout", logoutUser);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);


router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req, res) => {
    const token = generateToken(req.user);

    // 🔑 Store JWT in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // 🔑 Role-based redirect
    if (req?.user?.role) {
      return res.redirect(`${process.env.FRONTEND_URL}/`);
    }

    return res.redirect(`${process.env.FRONTEND_URL}/selectRole`);
  }
);


router.post("/setRole", verifyToken, async (req, res) => {
  const { role } = req.body;

  if (!["employer", "jobseeker"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "user is not found " })
  }
  user.role = role;
  await user.save();

  console.log("user id :", user._id)

  if (role === "employer") {
    // create only if it doesn't exist
    await Employer.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        companyName: "",
        experienceLevel: "Entry",
        aboutCompany: null
      },
      { upsert: true, new: true }
    );
  } else if (role === "jobseeker") {
    await JobSeeker.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        skills: [],
        resumeUrl: null
      },
      { upsert: true, new: true }
    );
  }
  console.log("new user:", user)

  res.status(200).json({ success: true, role: user.role, redirectTo: user.role === "employer" ? "/employerDashboard" : "/jobseekerDashboard" });
});


export default router;