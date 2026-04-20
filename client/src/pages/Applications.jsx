import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { ApplicationCard } from '../components/application/ApplicationCard'
import { fetchMyApplications as fetchApplications } from '../services/api'

const Applications = () => {
  const { user } = useUser()
  const [applications, setApplications] = useState([])

  useEffect(() => {
    const getApplications = async () => {
      try {
        const response = await fetchApplications(user.id)
        setApplications(response.data)
      } catch (error) {
        console.error('Error fetching applications:', error)
      }
    }

    if (user) {
      getApplications()
    }
  }, [user])

  return (
    <main className="px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-semibold text-slate-900">My Applications</h1>
        <p className="mt-2 text-lg text-slate-600">View and manage your job applications</p>

        <div className="mt-8 space-y-4">
          {applications.length === 0 ? (
            <p className="text-slate-600">You have not applied for any jobs yet.</p>
          ) : (
            applications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))
          )}
        </div>
      </section>
    </main>
  )
}

export default Applications