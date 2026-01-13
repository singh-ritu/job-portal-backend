import mongoose from "mongoose";
import Application from "../models/application.model.js"
import Job from "../models/job.model.js";

export const appliedJob = async (req, res) => {
    try {
        
        const {jobId} = req.params;
        const userId = req.user._id;
        const {resumeUrl} = req.body;
       

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({message: "Invalid Job Id"});
        }

        const job = await Job.findById(jobId);
        if(!job || !job.isActive){
            return res.status(404).json({message: "Job not found or is inactive"});
        }

        const finalResumeUrl = resumeUrl || req.user.resumeUrl;
        if(!finalResumeUrl){
            return res.status(400).json({message: "Resume URL is required to apply for the job"});
        }
        console.log("Final Resume URL:", finalResumeUrl);

        const alreadyApplied = await Application.findOne({ 
            job: jobId,
            applicant: userId,
        });
        if(alreadyApplied){
            return res.status(409).json({message: "You have already applied for this job", hasApplied: true});
        }
        const newApplication = await Application.create({
            job:jobId,
            applicant: userId,
            resumeUrl: finalResumeUrl,
        })
        console.log("Application created with ID:", newApplication)
        return res.status(201).json({message: "Application submitted successfully", applicationId: newApplication._id});

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({message: "You have already applied for this job"});
        }
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const getMyApplications = async (req, res) => {
    try {
        const userId = req.user._id;
        // console.log("Fetching applications for user ID:", userId);

        const applications  = await Application.find({applicant:userId})
        .populate('job')
        .sort({appliedAt: -1});

        // console.log("applications fetched:", applications);
        return res.status(200).json( applications)

    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

