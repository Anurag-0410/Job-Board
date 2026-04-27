import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobById } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ApplicationForm from '../components/application/ApplicationForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await fetchJobById(id);
        setJob(data);
      } catch (err) {
        setError('Failed to load job details');
      }
      setLoading(false);
    };
    loadJob();
  }, [id]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    if (user.role !== 'jobseeker') {
      setApplicationStatus('Only job seekers can apply for jobs');
      return;
    }

    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    setApplicationStatus('Applied successfully!');
    setShowApplicationForm(false);
  };

  const handleApplicationError = (errorMsg) => {
    setApplicationStatus(errorMsg || 'Failed to apply');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error || 'Job not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
              <p className="text-xl text-gray-600 mb-2">{job.companyName}</p>
              <div className="flex flex-wrap gap-4 text-gray-500">
                <span>📍 {job.location}</span>
                <span>💼 {job.type}</span>
                <span>💰 {job.salary}</span>
                <span>📊 {job.experience}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          
          {job.requirements && (
            <>
              <h3 className="text-lg font-semibold mt-6 mb-3">Requirements</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
            </>
          )}
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Company Info */}
        {job.company && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">About the Company</h2>
            <p className="text-gray-700">{job.company.companyDescription || 'Company details not available'}</p>
            {job.company.companyWebsite && (
              <a 
                href={job.company.companyWebsite} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Visit Company Website
              </a>
            )}
          </div>
        )}

        {/* Apply Button */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {applicationStatus && (
            <div className={`mb-4 p-3 rounded-lg ${applicationStatus.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {applicationStatus}
            </div>
          )}
          
          {isAuthenticated && user?.role === 'jobseeker' ? (
            <Button 
              onClick={handleApplyClick}
              className="w-full"
            >
              Apply Now
            </Button>
          ) : !isAuthenticated ? (
            <Button 
              onClick={() => navigate('/login', { state: { from: `/jobs/${id}` } })}
              className="w-full"
            >
              Login to Apply
            </Button>
          ) : (
            <div className="text-center text-gray-500">
              Only job seekers can apply for jobs
            </div>
          )}
        </div>

        {/* Application Form Modal */}
        {showApplicationForm && (
          <Modal isOpen={showApplicationForm} onClose={() => setShowApplicationForm(false)}>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Apply for {job.title}</h2>
              <ApplicationForm 
                jobId={id} 
                onSuccess={handleApplicationSuccess}
                onError={handleApplicationError}
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default JobDetails;