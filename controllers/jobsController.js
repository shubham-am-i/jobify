import Job from '../models/jobModel.js'
import ErrorResponse from '../utils/errorResponse.js'

// @desc  Create Job
// @route POST /api/v1/jobs/
export const createJob = async (req, res) => {
  const { position, company } = req.body
  if (!position || !company) {
    throw new ErrorResponse('Please provide all values', 400)
  }

  req.body.createdBy = req.user._id
  const job = await Job.create(req.body)

  res.status(201).json({ job })
}
export const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.id })
  res.status(200).json({
    jobs,
    totalJobs: jobs.length,
    numOfPages: 1,
  })
}

export const showStats = async (req, res) => {
  res.send('showStats')
}

export const updateJob = async (req, res) => {
  res.send('updateJob')
}

export const deleteJob = async (req, res) => {
  res.send('deleteJob')
}
