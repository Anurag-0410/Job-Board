import { useState } from 'react'
import { useUser } from '../context/UserContext'
import initialJobs from '../data/jobs'

const Admin = () => {
  const { user } = useUser()
  const [jobs, setJobs] = useState(initialJobs)
  const [showAddJob, setShowAddJob] = useState(false)
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    tag: ''
  })

  const [applications] = useState([
    { id: 1, jobId: 1, name: 'John Doe', email: 'john@example.com', job: 'Frontend Engineer', company: 'Nova Labs', date: '2026-04-10', status: 'Pending' },
    { id: 2, jobId: 2, name: 'Jane Smith', email: 'jane@example.com', job: 'Backend Developer', company: 'Bluewave', date: '2026-04-08', status: 'Reviewing' },
  ])

  const [activeTab, setActiveTab] = useState('jobs')

  const handleAddJob = (e) => {
    e.preventDefault()
    const job = {
      id: jobs.length + 1,
      ...newJob
    }
    setJobs([...jobs, job])
    setShowAddJob(false)
    setNewJob({ title: '', company: '', location: '', type: 'Full-time', salary: '', tag: '' })
  }

  const handleDeleteJob = (id) => {
    setJobs(jobs.filter(job => job.id !== id))
  }

  return (
    <main className="px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-slate-900">Admin Dashboard</h1>
            <p className="mt-2 text-lg text-slate-600">Manage jobs and applications</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
              Admin
            </span>
            <span className="text-slate-600">{user?.email}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-4 text-lg font-semibold ${
              activeTab === 'jobs'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-slate-500'
            }`}
          >
            Manage Jobs
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-4 text-lg font-semibold ${
              activeTab === 'applications'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-slate-500'
            }`}
          >
            Applications
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 text-lg font-semibold ${
              activeTab === 'users'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-slate-500'
            }`}
          >
            Users
          </button>
        </div>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="mt-8">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">All Jobs</h2>
              <button 
                onClick={() => setShowAddJob(true)}
                className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                + Add New Job
              </button>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
                    <th className="pb-4">Job Title</th>
                    <th className="pb-4">Company</th>
                    <th className="pb-4">Type</th>
                    <th className="pb-4">Applications</th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b border-slate-200">
                      <td className="py-4 text-slate-900">{job.title}</td>
                      <td className="py-4 text-slate-600">{job.company}</td>
                      <td className="py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                          {job.type}
                        </span>
                      </td>
                      <td className="py-4 text-slate-600">2</td>
                      <td className="py-4">
                        <button className="text-indigo-600 hover:text-indigo-700">Edit</button>
                        <button 
                          onClick={() => handleDeleteJob(job.id)}
                          className="ml-4 text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-slate-900">All Applications</h2>
            <div className="mt-6 space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{app.name}</h3>
                    <p className="text-slate-600">{app.email}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Applied for: {app.job} at {app.company}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        app.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : app.status === 'Reviewing'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {app.status}
                    </span>
                    <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-slate-900">Registered Users</h2>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-slate-600">Total Users: 1</p>
              <p className="mt-2 text-slate-600">Active Now: 1</p>
            </div>
          </div>
        )}
      </section>

      {/* Add Job Modal */}
      {showAddJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-slate-900">Add New Job</h2>
            
            <form onSubmit={handleAddJob} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Job Title</label>
                <input
                  type="text"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Company</label>
                <input
                  type="text"
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Location</label>
                <input
                  type="text"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Job Type</label>
                  <select
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>On-site</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Salary</label>
                  <input
                    type="text"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    placeholder="$80k - $100k"
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Skills / Tag</label>
                <input
                  type="text"
                  value={newJob.tag}
                  onChange={(e) => setNewJob({ ...newJob, tag: e.target.value })}
                  placeholder="React, Node.js, etc."
                  className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddJob(false)}
                  className="flex-1 rounded-full border border-slate-200 py-3 font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
                >
                  Add Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default Admin