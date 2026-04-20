import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../services/authService'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

const Register = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'jobseeker',
    // Job seeker fields
    phone: '',
    skills: '',
    experience: '',
    // Company fields
    companyName: '',
    companyDescription: '',
    companyWebsite: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match')
    }
    
    // Prepare data based on role
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    }

    if (formData.role === 'jobseeker') {
      userData.phone = formData.phone
      userData.skills = formData.skills.split(',').map(s => s.trim()).filter(s => s)
      userData.experience = formData.experience
    } else if (formData.role === 'company') {
      userData.companyName = formData.companyName
      userData.companyDescription = formData.companyDescription
      userData.companyWebsite = formData.companyWebsite
    }

    try {
      setError('')
      setLoading(true)
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create an account')
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>
        {error && <p className="mt-2 text-red-600 text-center mb-4">{error}</p>}
        
        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="jobseeker"
                checked={formData.role === 'jobseeker'}
                onChange={handleChange}
                className="mr-2"
              />
              Job Seeker
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="company"
                checked={formData.role === 'company'}
                onChange={handleChange}
                className="mr-2"
              />
              Company / HR
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* Job Seeker Fields */}
          {formData.role === 'jobseeker' && (
            <>
              <Input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
              <Input
                type="text"
                name="skills"
                placeholder="Skills (comma separated, e.g., React, Node.js, Python)"
                value={formData.skills}
                onChange={handleChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Experience</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-5 years">2-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>
            </>
          )}

          {/* Company Fields */}
          {formData.role === 'company' && (
            <>
              <Input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                required={formData.role === 'company'}
              />
              <div>
                <textarea
                  name="companyDescription"
                  placeholder="Company Description"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <Input
                type="url"
                name="companyWebsite"
                placeholder="Company Website (optional)"
                value={formData.companyWebsite}
                onChange={handleChange}
              />
            </>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <a href="/login" className="text-indigo-600">Login</a>
        </p>
      </div>
    </div>
  )
}

export default Register