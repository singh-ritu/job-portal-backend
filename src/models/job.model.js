import { application } from "express";
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({

    title:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    company:{
        type: String,
        required: true,
    },
    salary:{
        type: Number,
        required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["Junior", "Mid", "Senior"],
      required: [true, "Experience level is required"],
    },
    // isActive:{
    //     type: Boolean,
    //     default: true,
    // },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
},{timestamps:true}
)

const job = mongoose.model("Job", jobSchema)

export default job