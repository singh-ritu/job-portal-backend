import mongoose from "mongoose";

const employerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    trim: true,
    default: ""
  },
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior', 'Director', 'Executive'],
  },
  aboutCompany: {
    type: String,
    default: null,
  }
})

const Employer = mongoose.model("Employer", employerSchema)

export default Employer;