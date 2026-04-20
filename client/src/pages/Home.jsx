import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Dream Job Today
          </h1>
          <p className="text-xl mb-8 text-indigo-100">
            Connect with top companies and discover opportunities that match your skills
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/jobs" 
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Browse Jobs
            </Link>
            {!isAuthenticated && (
              <Link 
                to="/register" 
                className="bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Job Portal?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* For Job Seekers */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">👔</div>
            <h3 className="text-xl font-semibold mb-2">For Job Seekers</h3>
            <ul className="text-gray-600 space-y-2">
              <li>✓ Browse thousands of jobs</li>
              <li>✓ Filter by role, location, experience</li>
              <li>✓ One-click apply</li>
              <li>✓ Track application status</li>
              <li>✓ Get skill-based recommendations</li>
            </ul>
          </div>

          {/* For Companies */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold mb-2">For Companies</h3>
            <ul className="text-gray-600 space-y-2">
              <li>✓ Post jobs easily</li>
              <li>✓ Manage applications</li>
              <li>✓ Track applicant status</li>
              <li>✓ View applicant profiles</li>
              <li>✓ Dashboard with analytics</li>
            </ul>
          </div>

          {/* Platform Features */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Platform Features</h3>
            <ul className="text-gray-600 space-y-2">
              <li>✓ Responsive design</li>
              <li>✓ Secure authentication</li>
              <li>✓ Real-time updates</li>
              <li>✓ Role-based access</li>
              <li>✓ Easy to use</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-gray-100 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-8">
              Join thousands of job seekers and companies already using our platform
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                to="/register" 
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Register Now
              </Link>
              <Link 
                to="/login" 
                className="bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* User Dashboard CTA */}
      {isAuthenticated && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome back, {user?.name}!</h2>
            <p className="text-gray-600 mb-4">
              {user?.role === 'company' 
                ? 'Manage your posted jobs and view applicants from your dashboard.'
                : 'Browse jobs, track your applications, and find your dream job.'}
            </p>
            <Link 
              to="/dashboard" 
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home