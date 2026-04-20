import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyApplications, fetchRecommendedJobs, fetchMyJobs, fetchJobApplications, fetchApplicationStats } from '../services/api';
import JobCard from '../components/job/JobCard';
import Button from '../components/common/Button';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Job seeker state
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);

  // Company state
  const [myJobs, setMyJobs] = useState([]);
  const [jobApplicants, setJobApplicants] = useState({});
  const [stats, setStats] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (user?.role === 'jobseeker') {
        // Load job seeker data
        const [appsData, jobsData] = await Promise.all([
          fetchMyApplications(),
          fetchRecommendedJobs(),
        ]);
        setApplications(appsData);
        setRecommendedJobs(jobsData);
      } else if (user?.role === 'company') {
        // Load company data
        const [jobsData, statsData] = await Promise.all([
          fetchMyJobs(),
          fetchApplicationStats(),
        ]);
        setMyJobs(jobsData);
        setStats(statsData);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    }
    setLoading(false);
  };

  const loadJobApplicants = async (jobId) => {
    try {
      const applicants = await fetchJobApplications(jobId);
      setJobApplicants({ ...jobApplicants, [jobId]: applicants });
      setSelectedJobId(jobId);
    } catch (err) {
      setError('Failed to load applicants');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Applied': 'bg-blue-100 text-blue-800',
      'Shortlisted': 'bg-yellow-100 text-yellow-800',
      'Interview': 'bg-purple-100 text-purple-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Hired': 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            {user?.role === 'company' ? 'Company Dashboard' : 'Job Seeker Dashboard'}
          </h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
          <p className="text-sm text-gray-500">Role: {user?.role === 'company' ? 'Company/HR' : 'Job Seeker'}</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
        )}

        {/* ==================== JOB SEEKER DASHBOARD ==================== */}
        {user?.role === 'jobseeker' && (
          <div className="space-y-6">
            {/* My Applications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">My Applications</h2>
              {applications.length === 0 ? (
                <p className="text-gray-500">You haven't applied to any jobs yet.</p>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{app.jobId?.title || 'Job'}</h3>
                          <p className="text-gray-600">{app.jobId?.companyName}</p>
                          <p className="text-sm text-gray-500">
                            Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button 
                onClick={() => navigate('/jobs')}
                className="mt-4"
              >
                Browse More Jobs
              </Button>
            </div>

            {/* Recommended Jobs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Recommended Jobs Based on Your Skills</h2>
              {recommendedJobs.length === 0 ? (
                <p className="text-gray-500">No recommended jobs at the moment. Update your skills to get better recommendations!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedJobs.slice(0, 6).map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== COMPANY DASHBOARD ==================== */}
        {user?.role === 'company' && (
          <div className="space-y-6">
            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-gray-500 text-sm">Total Jobs Posted</h3>
                  <p className="text-3xl font-bold text-slate-900">{stats.totalJobs}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-gray-500 text-sm">Total Applications</h3>
                  <p className="text-3xl font-bold text-slate-900">
                    {stats.statusStats?.reduce((acc, s) => acc + s.count, 0) || 0}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-gray-500 text-sm">Shortlisted</h3>
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.statusStats?.find(s => s._id === 'Shortlisted')?.count || 0}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-gray-500 text-sm">Hired</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.statusStats?.find(s => s._id === 'Hired')?.count || 0}
                  </p>
                </div>
              </div>
            )}

            {/* My Posted Jobs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">My Posted Jobs</h2>
                <Button onClick={() => navigate('/jobs/create')}>
                  Post New Job
                </Button>
              </div>
              
              {myJobs.length === 0 ? (
                <p className="text-gray-500">You haven't posted any jobs yet.</p>
              ) : (
                <div className="space-y-4">
                  {myJobs.map((job) => (
                    <div key={job._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-gray-600">{job.location} • {job.type}</p>
                          <p className="text-sm text-gray-500">
                            Posted: {new Date(job.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button 
                          onClick={() => loadJobApplicants(job._id)}
                          className="text-sm"
                        >
                          View Applicants
                        </Button>
                      </div>

                      {/* Applicants List */}
                      {selectedJobId === job._id && jobApplicants[job._id] && (
                        <div className="mt-4 border-t pt-4">
                          <h4 className="font-medium mb-3">Applicants ({jobApplicants[job._id].length})</h4>
                          {jobApplicants[job._id].length === 0 ? (
                            <p className="text-gray-500">No applicants yet.</p>
                          ) : (
                            <div className="space-y-3">
                              {jobApplicants[job._id].map((app) => (
                                <div key={app._id} className="bg-gray-50 rounded p-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium">{app.applicantName}</p>
                                      <p className="text-sm text-gray-600">{app.applicantEmail}</p>
                                      {app.phone && <p className="text-sm text-gray-500">Phone: {app.phone}</p>}
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(app.status)}`}>
                                      {app.status}
                                    </span>
                                  </div>
                                  {app.resume && (
                                    <a 
                                      href={app.resume} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 text-sm hover:underline mt-2 inline-block"
                                    >
                                      View Resume
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;