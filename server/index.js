import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initializeTabs } from './utils/googleSheets.js'
import authRoutes from './routes/auth.js'
import classroomRoutes from './routes/classrooms.js'
import studentRoutes from './routes/students.js'
import dutyRoutes from './routes/duties.js'
import statusRoutes from './routes/status.js'
import adminRoutes from './routes/admins.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/classrooms', classroomRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/duties', dutyRoutes)
app.use('/api/status', statusRoutes)
app.use('/api/admins', adminRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Initialize Google Sheets tabs and start server
async function startServer() {
  try {
    console.log('Initializing Google Sheets tabs...')
    await initializeTabs()
    console.log('Google Sheets tabs initialized successfully')
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Error starting server:', error)
    process.exit(1)
  }
}

startServer()
