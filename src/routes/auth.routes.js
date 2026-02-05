import express from "express";
import passport from "passport";
import '../config/passport.js';
import { loginUser, registerUser, getMe, logoutUser, resetPassword, newPassword } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { generateToken } from "../utils/jwt.js";
import User from "../models/user.model.js";
import Employer from "../models/employer.model.js";
import JobSeeker from "../models/jobSeeker.model.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", verifyToken, getMe);

router.post("/forgot-Password", resetPassword);
router.put("/reset-Password/:token", newPassword)

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
    console.log("google user:", req.user)
    const user = req.user

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    if (!user.role) {
      return res.redirect(`${process.env.FRONTEND_URL}/selectRole`);
    }
    if (user.role === "jobseeker") {
      return res.redirect(`${process.env.FRONTEND_URL}/jobseekerDashboard`)
    } else if (user.role === "employer") {
      return res.redirect(`${process.env.FRONTEND_URL}/employerDashboard`);
    }
  }
);


router.post("/setRole", verifyToken, async (req, res) => {
  const { role } = req.body;
  console.log(req.body)
  if (!["employer", "jobseeker"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "user is not found " })
  }
  user.role = role;
  await user.save();

  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  console.log("token:", token)
  console.log("user id :", user._id)

  if (role === "employer") {

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