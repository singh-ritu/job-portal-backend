import mongoose from "mongoose";

const jobSeekerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  resumeUrl: {
    type: String,
    default: null,
  },
  skills: {
    type: [String],
    default: [],
  },
})

const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema)

export default JobSeeker;