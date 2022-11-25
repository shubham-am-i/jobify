import fs from 'fs'
import mongoose from 'mongoose'
import colors from 'colors'
import dotenv from 'dotenv'

// Load env vars
dotenv.config()

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load models
import Job from './models/jobModel.js'

// connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Read JSON files
const jobs = JSON.parse(fs.readFileSync(`${__dirname}/mock-data.json`, 'utf-8'))

const importData = async () => {
  try {
    await Job.create(jobs)

    console.log('Data Imported!'.green.inverse)
    process.exit(0)
  } catch (error) {
    console.log(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Job.deleteMany() //if we don't pass anything, it will delete everything

    console.log('Data Destroyed!'.red.inverse)
    process.exit(0)
  } catch (error) {
    console.log(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
