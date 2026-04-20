import Job from '../models/Job.js';

// Create a new job (Company/HR only)
export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      company: req.user._id,
      companyName: req.user.companyName,
    };
    const job = new Job(jobData);
    await job.save();
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    res.status(400).json({ message: 'Error creating job', error: error.message });
  }
};

// Get all jobs with filters, search, and pagination
export const getAllJobs = async (req, res) => {
  try {
    const { 
      search, 
      role, 
      location, 
      experience, 
      type, 
      page = 1, 
      limit = 10 
    } = req.query;

    // Build query
    const query = { status: 'active' };

    // Search by keyword (title, description, skills)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [{ $regex: search, $options: 'i' }] } },
      ];
    }

    // Filter by role/tag
    if (role) {
      query.role = { $regex: role, $options: 'i' };
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by experience
    if (experience) {
      query.experience = experience;
    }

    // Filter by job type
    if (type) {
      query.type = type;
    }

    // Pagination
    const skip = (page - 1) * limit;
    
    const jobs = await Job.find(query)
      .populate('company', 'companyName companyWebsite')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.status(200).json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

// Get jobs posted by current company/HR
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

// Get recommended jobs for job seeker based on skills
export const getRecommendedJobs = async (req, res) => {
  try {
    const userSkills = req.user.skills || [];
    
    if (userSkills.length === 0) {
      // If no skills set, return recent active jobs
      const jobs = await Job.find({ status: 'active' })
        .populate('company', 'companyName')
        .sort({ createdAt: -1 })
        .limit(10);
      return res.status(200).json(jobs);
    }

    // Find jobs matching user's skills
    const jobs = await Job.find({ 
      status: 'active',
      skills: { $in: userSkills }
    })
      .populate('company', 'companyName')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommended jobs', error: error.message });
  }
};

// Get a job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'companyName companyDescription companyWebsite');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job', error: error.message });
  }
};

// Update a job (Company/HR who created it or Admin)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the owner or admin
    if (job.company.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
  } catch (error) {
    res.status(400).json({ message: 'Error updating job', error: error.message });
  }
};

// Delete a job (Company/HR who created it or Admin)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the owner or admin
    if (job.company.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
};