import Application from '../models/Application.js';
import Job from '../models/Job.js';

// Apply for a job (Job seeker only)
export const applyForJob = async (req, res) => {
  const { jobId, applicantName, applicantEmail, resume, coverLetter, phone } = req.body;

  try {
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({ 
      jobId, 
      userId: req.user._id 
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const newApplication = new Application({
      jobId,
      userId: req.user._id,
      applicantName: applicantName || req.user.name,
      applicantEmail: applicantEmail || req.user.email,
      resume,
      coverLetter,
      phone: phone || req.user.phone,
      status: 'Applied',
    });

    await newApplication.save();
    res.status(201).json({ 
      message: 'Application submitted successfully', 
      application: newApplication 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting application', error: error.message });
  }
};

// Get applications for a specific job (Company/HR who posted the job or Admin)
export const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    
    // Check if job exists and user is the owner
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Only the company that posted the job or admin can view applications
    if (job.company.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ jobId })
      .populate('userId', 'name email phone skills experience')
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

// Get all applications by current user (Job seeker)
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate({
        path: 'jobId',
        select: 'title companyName location type salary',
      })
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

// Update application status (Company/HR or Admin)
export const updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  const validStatuses = ['Applied', 'Shortlisted', 'Interview', 'Rejected', 'Hired'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const application = await Application.findById(applicationId)
      .populate('jobId');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the company that posted the job or admin
    if (application.jobId.company.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    application.updatedAt = Date.now();
    await application.save();

    res.status(200).json({ 
      message: 'Application status updated', 
      application 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating application status', error: error.message });
  }
};

// Get application statistics for company/HR dashboard
export const getApplicationStats = async (req, res) => {
  try {
    // Get all jobs posted by this company
    const jobs = await Job.find({ company: req.user._id });
    const jobIds = jobs.map(job => job._id);

    // Get application counts by status
    const stats = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { 
        $group: { 
          _id: '$status', 
          count: { $sum: 1 } 
        } 
      }
    ]);

    // Get total applications per job
    const applicationsPerJob = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { 
        $group: { 
          _id: '$jobId', 
          count: { $sum: 1 },
          shortlisted: { 
            $sum: { $cond: [{ $eq: ['$status', 'Shortlisted'] }, 1, 0] } 
          },
          interview: { 
            $sum: { $cond: [{ $eq: ['$status', 'Interview'] }, 1, 0] } 
          },
          hired: { 
            $sum: { $cond: [{ $eq: ['$status', 'Hired'] }, 1, 0] } 
          },
        } 
      }
    ]);

    res.status(200).json({ 
      statusStats: stats,
      applicationsPerJob,
      totalJobs: jobs.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application stats', error: error.message });
  }
};

// Delete an application (Job seeker can withdraw their application)
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only the applicant or admin can delete
    if (application.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    }

    await Application.findByIdAndDelete(req.params.applicationId);
    res.status(200).json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error withdrawing application', error: error.message });
  }
};