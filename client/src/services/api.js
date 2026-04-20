import axios from 'axios';

const API_URL = '/api';

// Get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ==================== JOBS API ====================

// Get all jobs with filters and pagination
export const fetchJobs = async (params = {}) => {
  const response = await axios.get(`${API_URL}/jobs`, { params });
  return response.data;
};

// Get recommended jobs for job seeker
export const fetchRecommendedJobs = async () => {
  const response = await axios.get(`${API_URL}/jobs/recommended`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get jobs posted by current company
export const fetchMyJobs = async () => {
  const response = await axios.get(`${API_URL}/jobs/my-jobs`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get single job by ID
export const fetchJobById = async (jobId) => {
  const response = await axios.get(`${API_URL}/jobs/${jobId}`);
  return response.data;
};

// Create a new job (Company only)
export const createJob = async (jobData) => {
  const response = await axios.post(`${API_URL}/jobs`, jobData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Update a job
export const updateJob = async (jobId, jobData) => {
  const response = await axios.put(`${API_URL}/jobs/${jobId}`, jobData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Delete a job
export const deleteJob = async (jobId) => {
  const response = await axios.delete(`${API_URL}/jobs/${jobId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// ==================== APPLICATIONS API ====================

// Apply for a job
export const applyForJob = async (applicationData) => {
  const response = await axios.post(`${API_URL}/applications/apply`, applicationData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get my applications (Job seeker)
export const fetchMyApplications = async () => {
  const response = await axios.get(`${API_URL}/applications/my-applications`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get applications for a specific job (Company/HR)
export const fetchJobApplications = async (jobId) => {
  const response = await axios.get(`${API_URL}/applications/job/${jobId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get application stats for company dashboard
export const fetchApplicationStats = async () => {
  const response = await axios.get(`${API_URL}/applications/stats`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Update application status
export const updateApplicationStatus = async (applicationId, status) => {
  const response = await axios.patch(
    `${API_URL}/applications/${applicationId}/status`,
    { status },
    { headers: getAuthHeader() }
  );
  return response.data;
};

// Withdraw application
export const withdrawApplication = async (applicationId) => {
  const response = await axios.delete(`${API_URL}/applications/${applicationId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
