import mongoose from "mongoose";
import User from "../models/user.model.js";

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const {skills, resumeURl} = req.body;

        const updateData = {};

        if (skills !== undefined) {
            if (!Array.isArray(skills)) {
                return res.status(400).json({message: "Skills must be an array of strings"});
            }
            updateData.skills = skills.map(skill => skill.trim());
        }

        if (resumeURl !== undefined) {
            if(typeof resumeURl !== 'string') {
                return res.status(400).json({message: "Resume URL must be a string"});
            }
            updateData.resumeURl = resumeURl;
        }

                if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "Nothing to update"
            });
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                updateData,
                {new: true, runValidators: true}
            ).select("skills resumeURl");
            
            return res.status(200).json({
                message: "Profile updated successfully",
                user: updatedUser
            })
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}