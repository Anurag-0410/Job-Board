import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchJobs } from '../services/api'
import JobList from '../components/job/JobList'
import JobFilters from '../components/job/JobFilters'
import Input from '../components/common/Input'

const Jobs = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    location: '',
    experience: '',
    type: '',
  })
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })

  const loadJobs = async (page = 1) => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: 10,
        ...filters,
      }
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key]
      })
      
      const data = await fetchJobs(params)
      setJobs(data.jobs)
      setPagination({
        page: data.currentPage,
        totalPages: data.totalPages,
        total: data.total,
      })
    } catch (err) {
      setError('Failed to load jobs')
    }
    setLoading(false)
  }

  useEffect(() => {
    loadJobs(1)
  }, [])

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters })
    loadJobs(1) // Reset to first page when filters change
  }

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm })
    loadJobs(1)
  }

  const handlePageChange = (newPage) => {
    loadJobs(newPage)
  }

  const handleApply = (jobId) => {
    navigate(`/jobs/${jobId}`)
  }

  return (
    <main className="px-4 py-8 min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Your Dream Job</h1>
          <p className="text-gray-600">Browse through thousands of job opportunities</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search jobs by title, skills, or keywords..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <JobFilters onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="text-center py-10">
            <div className="text-gray-500">Loading jobs...</div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="text-red-500">{error}</div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-gray-500">No jobs found matching your criteria</div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Showing {jobs.length} of {pagination.total} jobs
            </div>
            <JobList jobs={jobs} onApply={handleApply} />
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default Jobs