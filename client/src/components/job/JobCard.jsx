import React from 'react';

const JobCard = ({ job, onApply }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
      <p className="text-slate-600">{job.companyName}</p>
      <p className="text-slate-500">{job.location}</p>
      <span className="inline-block mt-2 rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700">
        {job.type}
      </span>
      <p className="mt-4 text-slate-700">{job.salary}</p>
      <button
        onClick={() => onApply(job._id)}
        className="mt-4 w-full rounded-full bg-indigo-600 py-2 text-white hover:bg-indigo-700 transition-colors duration-200"
      >
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;