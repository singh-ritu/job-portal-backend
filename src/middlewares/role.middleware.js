const employerOnly = (req, res, next) => {
    if(!req.user || req.user.role  !== 'employer') {
        return res.status(403).json({ message: 'Unauthorized: Employer access required' });
    }
    next();
};
export default employerOnly;