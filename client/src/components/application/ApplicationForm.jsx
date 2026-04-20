import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';

const ApplicationForm = ({ jobId }) => {
  const { user } = useUser();
  const { applyForJob } = useAuth();
  const [applicationData, setApplicationData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    resume: '',
    coverLetter: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplicationData({ ...applicationData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await applyForJob(jobId, applicationData);
    // Optionally reset the form or show a success message
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
        label="Resume"
        name="resume"
        type="file"
        onChange={(e) => setApplicationData({ ...applicationData, resume: e.target.files[0] })}
        required
      />
      <Input
        label="Cover Letter"
        name="coverLetter"
        value={applicationData.coverLetter}
        onChange={handleChange}
        required
      />
      <Button type="submit" className="w-full">
        Submit Application
      </Button>
    </form>
  );
};

export default ApplicationForm;