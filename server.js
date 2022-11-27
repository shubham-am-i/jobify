// native imports
import path from 'path'
import { fileURLToPath } from 'url'

// external imports
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import 'express-async-errors'
import morgan from 'morgan'
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'

// local imports
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import connectDB from './config/db.js'
// import routers
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'

dotenv.config()
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middlewares
app.use(express.json())
app.use(express.static(path.resolve(__dirname, './client/build')))
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// Mount Routers
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', jobsRouter)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build/', 'index.html'))
})

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
