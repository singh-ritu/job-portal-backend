import JobSeeker from "../models/jobSeeker.model.js"
import User from "../models/user.model.js"

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const updateData = {};

    if (req.body.skills) {
      let skills = req.body.skills;

      if (typeof skills === "string") {
        try {
          skills = JSON.parse(skills);
        } catch (e) {
          return res.status(400).json({ message: "Invalid JSON format for skills" });
        }
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


    const updatedUser = await JobSeeker.findOneAndUpdate(

      { userId: userId },
      { $set: updateData },
      {
        runValidators: true,
        new: true
      }
    );

    if (!updatedUser) {

      return res.status(404).json({
        message: "JobSeeker profile not found for that user ID"
      });
    }

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
  const { user } = req;
  const userId = user._id;
  const jobSeeker = await JobSeeker.findOne({ userId });

  const jobSeekerUser = await User.findById(userId)

  console.log("jobseeker:", jobSeeker)

  const profileResponse = {
    name: jobSeekerUser.name,
    email: jobSeekerUser.email,
    resumeUrl: jobSeeker.resumeUrl,
    skills: jobSeeker.skills
  }

  res.json(profileResponse);
}
