import mongoose from "mongoose";

const employerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior', 'Director', 'Executive'],
    required: true,
  },
  aboutCompany: {
    type: String,
    default: null,
  }
})

const Employer = mongoose.model("Employer", employerSchema)

export default Employer;