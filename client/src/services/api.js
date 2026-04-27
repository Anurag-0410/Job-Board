import axios from 'axios';

const API_URL = '/api';

// Create axios instance with interceptor for auth
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ==================== JOBS API ====================

// Get all jobs with filters and pagination
export const fetchJobs = async (params = {}) => {
  const response = await axiosInstance.get('/jobs', { params });
  return response.data;
};

// Get recommended jobs for job seeker
export const fetchRecommendedJobs = async () => {
  const response = await axiosInstance.get('/jobs/recommended');
  return response.data;
};

// Get jobs posted by current company
export const fetchMyJobs = async () => {
  const response = await axiosInstance.get('/jobs/my-jobs');
  return response.data;
};

// Get single job by ID
export const fetchJobById = async (jobId) => {
  const response = await axiosInstance.get(`/jobs/${jobId}`);
  return response.data;
};

// Create a new job (Company only)
export const createJob = async (jobData) => {
  const response = await axiosInstance.post('/jobs', jobData);
  return response.data;
};

// Update a job
export const updateJob = async (jobId, jobData) => {
  const response = await axiosInstance.put(`/jobs/${jobId}`, jobData);
  return response.data;
};

// Delete a job
export const deleteJob = async (jobId) => {
  const response = await axiosInstance.delete(`/jobs/${jobId}`);
  return response.data;
};

// ==================== APPLICATIONS API ====================

// Apply for a job
export const applyForJob = async (applicationData) => {
  const response = await axiosInstance.post('/applications/apply', applicationData);
  return response.data;
};

// Get my applications (Job seeker)
export const fetchMyApplications = async () => {
  const response = await axiosInstance.get('/applications/my-applications');
  return response.data;
};

// Get applications for a specific job (Company/HR)
export const fetchJobApplications = async (jobId) => {
  const response = await axiosInstance.get(`/applications/job/${jobId}`);
  return response.data;
};

// Get application stats for company dashboard
export const fetchApplicationStats = async () => {
  const response = await axiosInstance.get('/applications/stats');
  return response.data;
};

// Update application status
export const updateApplicationStatus = async (applicationId, status) => {
  const response = await axiosInstance.patch(
    `/applications/${applicationId}/status`,
    { status }
  );
  return response.data;
};

// Withdraw application
export const withdrawApplication = async (applicationId) => {
  const response = await axiosInstance.delete(`/applications/${applicationId}`);
  return response.data;
};
