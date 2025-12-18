import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    applicant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    resumeUrl:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: ["Applied", "Under Review", "Shortlisted",  "Interview Scheduled", "Offered", "Rejected"],
        default: "Applied",
    },
    appliedAt:{
        type: Date,
        default: Date.now,
    }
}, {timestamps:true})

applicationSchema.index({job: 1, applicant: 1}, {unique: true});

export default mongoose.model("Application", applicationSchema);