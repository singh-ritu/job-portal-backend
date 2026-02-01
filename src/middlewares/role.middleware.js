import { USER_ENUMS } from "../enums/user.enums.js";

export const employerOnly = (req, res, next) => {
    console.log("Role Middleware - User:", req.user);
    if (!req.user || req.user.role !== USER_ENUMS.EMPLOYER) {
        return res.status(403).json({ message: 'Unauthorized: Employer access required' });
    }
    next();
};


export const jobSeekerOnly = (req, res, next) => {
    if (!req.user || req.user.role !== USER_ENUMS.JOB_SEEKER) {
        return res.status(403).json({ message: 'Unauthorized: Job Seeker access required' });
    }
    next();
}

