import express from 'express';

import{ createJob, updateJob, deleteJob, getJobsByEmployer} from '../controllers/job.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';
import employerOnly from '../middlewares/role.middleware.js';

const router = express.Router();

router.post("/", verifyToken, employerOnly,createJob);
router.get("/my-jobs", verifyToken, employerOnly, getJobsByEmployer);

router.put("/:job-id", verifyToken, employerOnly, updateJob);

router.delete(" /:job-id", verifyToken, employerOnly, deleteJob);
export default router;