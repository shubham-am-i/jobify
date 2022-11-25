import Job from '../models/jobModel.js'
import ErrorResponse from '../utils/errorResponse.js'
import { isOwner } from '../utils/checkPermissions.js'

// @desc    Create Job
// @route   POST /api/v1/jobs/
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

// @desc    Update Job
// @route   PATCH /api/v1/jobs/:id
export const updateJob = async (req, res) => {
  const { id } = req.params
  const { position, company, jobLocation, jobType, status } = req.body
  if (!position || !company)
    throw new ErrorResponse('Please provide all values', 400)

  const job = await Job.findOne({ _id: id })
  if (job) {
    isOwner(req.user, job.createdBy)
    job.position = position
    job.company = company
    job.jobLocation = jobLocation
    job.jobType = jobType
    job.status = status
    await job.save()
    res.status(200).json({ job })
  } else {
    throw new ErrorResponse(`No job with id ${id}`, 404)
  }
}

// @desc    Delete Job
// @route   DELETE /api/v1/jobs/:id
export const deleteJob = async (req, res) => {
  const { id } = req.params
  const job = await Job.findOne({ _id: id })

  if (job) {
    isOwner(req.user, job.createdBy)

    await job.remove()
    res.status(200).json({ msg: 'Success! Job removed' })
  } else {
    throw new ErrorResponse(`No job with id ${id}`, 404)
  }
}
