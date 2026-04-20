import express from 'express'
import { register, login, logout, getCurrentUser, updateProfile } from '../controllers/authController'
import { validateSignup, validateLogin } from '../middleware/validation.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Route for user registration
router.post('/register', validateSignup, register)

// Route for user login
router.post('/login', validateLogin, login)

// Route for user logout
router.post('/logout', logout)

// Route to get current user profile
router.get('/me', authenticate, getCurrentUser)

// Route to update user profile
router.put('/profile', authenticate, updateProfile)

export default router