import Job from "../models/job.model.js";

export const createJob = async(req, res, next) => {
    try {
        const {title, description, location, company, salary, experienceLevel} = req.body

        if( !title || !description || !location || !company || salary ===undefined || !experienceLevel){
            return res.status(400).json({message:"All required fields must be provided"})
        }

        const job = new Job({
            title, description, location, company, salary, experienceLevel, postedBy:req.user._id
        });

        await job.save();

        return res.status(201).json({message:"job created successfully", job})

    } catch (error) {
        next(error)
    }
}

export const updateJob = async (req, res, next) => {
    try {
        const {jobId} = req.params;
        const update = req.body;
        
        const job = await Job.findById(jobId);

        if(!job){
            return res.status(404).json({message:"Job not found"})
        }

        if(job.postedBy.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"Unauthorized to update this job"})
        }

        const allowedUpdates = ["title", "description", "location", "company", "salary", "experienceLevel"];
        allowedUpdates.forEach((field) => {
            if(update[field] !== undefined){
                job[field] = update[field];
            }
        });
        await job.save();

        return res.status(200).json({message:"Job updated successfully", job})
    } catch (error) {
        next(error)
    }
}

export const deleteJob = async (req, res, next) => {
    try {
        const {jobId} = req.params;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({message:"Job not found"})  
        }

        if(job.postedBy.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"Unauthorized to delete this job"})
        }

        await job.deleteOne();

        return res.status(200).json({message:"Job deleted successfully"})

    } catch (error) {
        next(error)
    }
}
export const getJobsByEmployer = async (req, res, next) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({ jobs });
    } catch (error) {
        next(error)
    }
}

