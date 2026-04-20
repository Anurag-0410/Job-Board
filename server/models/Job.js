import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Remote', 'Hybrid', 'On-site'],
    default: 'Full-time',
  },
  salary: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true, // e.g., "0-1 years", "1-2 years", "2-5 years"
  },
  skills: [{
    type: String,
  }],
  role: {
    type: String, // e.g., "Frontend", "Backend", "Intern", "Fresher"
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for search
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });

const Job = mongoose.model('Job', jobSchema);

export default Job;