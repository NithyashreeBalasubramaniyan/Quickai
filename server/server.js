// server.js
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { clerkMiddleware, requireAuth } from '@clerk/express'
import airoute from './router/aiRoute.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './router/userRoutes.js'

const app = express()

connectCloudinary()

const allowedOrigins = ['https://quick-ai-client-lemon.vercel.app'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true // if needed
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Clerk middleware
app.use(clerkMiddleware())


// Public route (no auth needed)
app.get('/', (req, res) => {
 res.send('server is live')
})

app.use(requireAuth())

app.use('/api/ai', airoute)
app.use('/api/user', userRouter)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log('server is running at', PORT)
})
