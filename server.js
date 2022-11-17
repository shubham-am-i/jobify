// native imports

// external imports
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'

// local imports
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import connectDB from './config/db.js'

dotenv.config()
const app = express()

// app.get('/', (req, res) => {
//   throw new Error()
// })

app.use(notFound)
app.use(errorHandler)

const port = process.env.port || 5000

const bootstrap = async () => {
  await connectDB()
  app.listen(port, () =>
    console.log(`Server is running on port ${port}`.yellow.bold)
  )
}

bootstrap()
