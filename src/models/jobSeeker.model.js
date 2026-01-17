import mongoose from "mongoose";

const jobSeekerSchema = new mongoose.Schema({
  resumeUrl: {
    type: String,
    default: null,
  },
  skills: {
    type: [String],
    default: [],
  },
})

const jobSeeker = mongoose.model("jobSeeker", jobSeekerSchema)

export default jobSeeker;