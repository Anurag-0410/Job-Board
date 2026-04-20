import { useState, useEffect } from 'react'
import { fetchJobs, createJob, deleteJob } from '../services/api'

const useJobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobData = await fetchJobs()
        setJobs(jobData)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [])

  const addJob = async (newJob) => {
    try {
      const createdJob = await createJob(newJob)
      setJobs((prevJobs) => [...prevJobs, createdJob])
    } catch (err) {
      setError(err)
    }
  }

  const removeJob = async (jobId) => {
    try {
      await deleteJob(jobId)
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId))
    } catch (err) {
      setError(err)
    }
  }

  return { jobs, loading, error, addJob, removeJob }
}

export default useJobs