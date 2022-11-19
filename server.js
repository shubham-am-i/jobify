// native imports

// external imports
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import 'express-async-errors'

// local imports
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import connectDB from './config/db.js'
import logger from './middlewares/loggerMiddleware.js'
// import routers
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'
dotenv.config()
const app = express()

// Middlewares
app.use(express.json())
app.use(logger)

// Mount Routers
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', jobsRouter)

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000

const bootstrap = async () => {
  await connectDB()
  app.listen(port, () =>
    console.log(`Server is running on port ${port}`.yellow.bold)
  )
}

bootstrap()
