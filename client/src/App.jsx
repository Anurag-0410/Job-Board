import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import Navbar from './components/common/Navbar'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import JobDetails from './pages/JobDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import Admin from './pages/admin'
import CreateJob from './pages/CreateJob'
import ProtectedRoute from './components/common/ProtectedRoute'

const App = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jobs/create" 
              element={
                <ProtectedRoute allowedRoles={['company', 'admin']}>
                  <CreateJob />
                </ProtectedRoute>
              } 
            />
            <Route path="/applications" element={<Applications />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </UserProvider>
    </AuthProvider>
  )
}

export default App