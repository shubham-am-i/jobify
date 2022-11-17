// native imports

// external imports
import express from 'express'
import colors from 'colors'

// local imports
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'

const app = express()

// app.get('/', (req, res) => {
//   throw new Error()
// })

app.use(notFound)
app.use(errorHandler)

const port = process.env.port || 5000
app.listen(port, () =>
  console.log(`Server is running on port ${port}`.yellow.bold)
)
