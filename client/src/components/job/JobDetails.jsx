import React from 'react';
import { useParams } from 'react-router-dom';
import { useJobs } from '../../hooks/useJobs';

const JobDetails = () => {
  const { jobId } = useParams();
  const { jobs } = useJobs();
  const job = jobs.find((job) => job.id === parseInt(jobId));

  if (!job) {
    return <div className="text-center text-red-500">Job not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
      <p className="mt-2 text-lg text-slate-600">{job.company}</p>
      <p className="mt-4 text-slate-700">{job.description}</p>
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-slate-900">Details</h2>
        <p className="mt-2 text-slate-600">Location: {job.location}</p>
        <p className="mt-2 text-slate-600">Type: {job.type}</p>
        <p className="mt-2 text-slate-600">Salary: {job.salary}</p>
        <p className="mt-2 text-slate-600">Skills: {job.tag}</p>
      </div>
      <button className="mt-6 w-full rounded-full bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700">
        Apply Now
      </button>
    </div>
  );
};

export default JobDetails;