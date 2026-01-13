import mongoose from "mongoose";
import User from "../models/user.model.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = {};
   
    if (req.body.skills) {
      let skills = req.body.skills;

      if (typeof skills === "string") {
        skills = JSON.parse(skills);
      }

      if (!Array.isArray(skills)) {
        return res.status(400).json({
          message: "Skills must be an array of strings",
        });
      }

      updateData.skills = skills.map(skill => skill.trim());
    }

   
    if (req.body.resumeUrl) {
      updateData.resumeUrl = req.body.resumeUrl; 
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("skills resumeUrl");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getMyProfile = async (req, res) => {
    res.json(req.user);
}
