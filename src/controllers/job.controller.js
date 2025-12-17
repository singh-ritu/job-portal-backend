import Job from "../models/job.model.js";

export const createJob = async(req, res, next) => {
    try {
        const {title, description, location, company, jobType, salary, experienceLevel, isActive} = req.body

        if( !title || !description || !location || !company || !jobType || salary === null || !experienceLevel || isActive === null){
            return res.status(400).json({message:"All required fields must be provided"})
        }

        const job = new Job({
            title, description, location, company, jobType, salary, experienceLevel, isActive, postedBy:req.user._id
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

        const allowedUpdates = ["title", "description", "location", "company","jobType","isActive", "salary", "experienceLevel"];
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

export const getAllJobs = async (req, res, next) => {
    
    try {
        console.log(req.query);
         const page = Number(req.query.page) || 1;
         const limit = Number(req.query.limit) || 10;

            const keyword = req.query.keyword || "";
            const location = req.query.location || "";
            const jobType = req.query.jobType || "";

            const skip = (page - 1) * limit;

            const query = {isActive: true};

            if (keyword) {
                query.title = { $regex: keyword, $options: "i" };
            }

            if (location) {
                console.log(query.location);
                query.location = {$regex: location, $options: "i"};
            }
            if (jobType) {
                query.jobType = {$regrex: jobType, $options: "i"};
         }
        
            const jobs = await Job.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

            const totalJobs = await Job.countDocuments(query);

              res.set("Cache-Control", "no-store");

        return res.status(200).json({
            success:true,
            totalJobs,
            currentPage: page,
            totalPages: Math.ceil(totalJobs / limit),
            jobs,
        })
    } catch (error) {
        next(error)
    }
}


