import React from 'react'
import JobCard from './JobCard'

const JobList = ({ jobs, onApply }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map(job => (
        <JobCard key={job._id} job={job} onApply={onApply} />
      ))}
    </div>
  )
}

export default JobList