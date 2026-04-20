import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicantName: {
    type: String,
    required: true
  },
  applicantEmail: {
    type: String,
    required: true,
  },
  resume: {
    type: String, // URL to resume file
    required: true
  },
  coverLetter: {
    type: String
  },
  phone: {
    type: String
  },
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Interview', 'Rejected', 'Hired'],
    default: 'Applied'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
applicationSchema.index({ jobId: 1, userId: 1 });
applicationSchema.index({ userId: 1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;