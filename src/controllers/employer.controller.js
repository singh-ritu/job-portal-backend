import Employer from "../models/employer.model.js";
import User from "../models/user.model.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const updateData = {};

    if (req.body.companyName) {
      updateData.companyName = req.body.companyName
    }
    if (req.body.experienceLevel) {
      updateData.experienceLevel = req.body.experienceLevel;
    }
    if (req.body.aboutCompany) {
      updateData.aboutCompany = req.body.aboutCompany;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Nothing to Update" })
    }
    console.log("updated data:", updateData)
    const updatedEmployer = await Employer.findOneAndUpdate(
      { userId: userId },
      { $set: updateData },
      {
        runValidators: true,
        new: true
      }
    );
    if (!updatedEmployer) {
      return res.status(404).json({
        message: "employer Profile not found for that userId"
      })
    }

    return res.status(200).json({
      message: "profile updated successfully",
      user: updatedEmployer,
    })

  } catch (error) {
    console.error("Update profile err", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
export const getMyProfile = async (req, res) => {

  try {
    const { user } = req;
    const userId = user._id;

    console.log(user)

    if (!userId) {
      return res.status(400).json({ message: "UserId not found" })
    }

    const employer = await Employer.findOne({ userId });

    const employerUser = await User.findById(userId)
    console.log("Employer:", employer)

    const profileResponse = {
      name: employerUser.name,
      email: employerUser.email,
      companyName: employer.companyName,
      experienceLevel: employer.experienceLevel,
      aboutCompany: employer.aboutCompany
    }

    return res.status(200).json(profileResponse)
  } catch (error) {
    console.log("getMyProfile err", error)
    return res.status(500).json({ message: "Internal server error" })
  }

}