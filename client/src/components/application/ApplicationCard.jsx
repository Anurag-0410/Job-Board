import React from 'react';

const ApplicationCard = ({ application }) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{application.name}</h3>
        <p className="text-slate-600">{application.email}</p>
        <p className="mt-1 text-sm text-slate-500">
          Applied for: {application.job} at {application.company}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            application.status === 'Pending'
              ? 'bg-yellow-100 text-yellow-700'
              : application.status === 'Reviewing'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {application.status}
        </span>
        <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
          View
        </button>
      </div>
    </div>
  );
};

export { ApplicationCard };