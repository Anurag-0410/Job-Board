import express from 'express'
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  getRecommendedJobs,
} from '../controllers/jobController.js'
import { authenticate, authorizeCompanyOrAdmin } from '../middleware/auth.js'
import { validateJob } from '../middleware/validation.js'

const router = express.Router()

// Route to get all jobs (public)
router.get('/', getAllJobs)

// Route to get recommended jobs for job seeker
router.get('/recommended', authenticate, getRecommendedJobs)

// Route to get jobs posted by current company/HR
router.get('/my-jobs', authenticate, authorizeCompanyOrAdmin, getMyJobs)

// Route to create a new job (Company/HR only)
router.post('/', authenticate, authorizeCompanyOrAdmin, validateJob, createJob)

// Route to get a job by ID
router.get('/:id', getJobById)

// Route to update a job by ID (Owner or Admin)
router.put('/:id', authenticate, authorizeCompanyOrAdmin, updateJob)

// Route to delete a job by ID (Owner or Admin)
router.delete('/:id', authenticate, authorizeCompanyOrAdmin, deleteJob)

export default router