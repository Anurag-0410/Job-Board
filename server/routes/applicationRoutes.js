import express from 'express';
import {
  applyForJob,
  getMyApplications,
  updateApplicationStatus,
  getJobApplications,
  getApplicationStats,
  deleteApplication,
} from '../controllers/applicationController.js';
import { authenticate, authorizeJobSeeker, authorizeCompanyOrAdmin } from '../middleware/auth.js';
import { validateApplication } from '../middleware/validation.js';

const router = express.Router();

// Apply for a job (Job seeker only)
router.post('/apply', authenticate, authorizeJobSeeker, validateApplication, applyForJob);

// Get my applications (Job seeker)
router.get('/my-applications', authenticate, authorizeJobSeeker, getMyApplications);

// Get applications for a specific job (Company/HR who posted the job)
router.get('/job/:jobId', authenticate, authorizeCompanyOrAdmin, getJobApplications);

// Get application stats for company dashboard
router.get('/stats', authenticate, authorizeCompanyOrAdmin, getApplicationStats);

// Update application status (Company/HR or Admin)
router.patch('/:applicationId/status', authenticate, authorizeCompanyOrAdmin, updateApplicationStatus);

// Withdraw application (Job seeker)
router.delete('/:applicationId', authenticate, authorizeJobSeeker, deleteApplication);

export default router;