
import authRoutes from './routes/authRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'
import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

config({ path: path.resolve(__dirname, '.env') })

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000', // Adjust this to your frontend URL
  credentials: true,
}))

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})