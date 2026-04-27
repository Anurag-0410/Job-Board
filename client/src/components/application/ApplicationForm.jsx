import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';

const ApplicationForm = ({ jobId, onSuccess, onError }) => {
  const { user } = useUser();
  const { applyForJob } = useAuth();
  const [applicationData, setApplicationData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    resume: '',
    coverLetter: ''
  });
  const [loading, setLoading] = useState(false);
  const [resumeFileName, setResumeFileName] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplicationData({ ...applicationData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setApplicationData({ ...applicationData, resume: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!applicationData.resume) {
      if (onError) onError('Please upload a resume');
      return;
    }
    setLoading(true);
    try {
      await applyForJob(jobId, applicationData);
      if (onSuccess) onSuccess();
      setApplicationData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        resume: '',
        coverLetter: ''
      });
      setResumeFileName('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error submitting application';
      if (onError) onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={applicationData.name}
        onChange={handleChange}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={applicationData.email}
        onChange={handleChange}
        required
      />
      <Input
        label="Phone"
        name="phone"
        value={applicationData.phone}
        onChange={handleChange}
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resume <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          required
          className="block w-full border border-gray-300 rounded-lg p-2 text-sm"
        />
        {resumeFileName && (
          <p className="text-sm text-green-600 mt-1">✓ {resumeFileName} selected</p>
        )}
      </div>
      <Input
        label="Cover Letter"
        name="coverLetter"
        value={applicationData.coverLetter}
        onChange={handleChange}
        placeholder="Tell us why you're a great fit for this job..."
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  );
};

export default ApplicationForm;