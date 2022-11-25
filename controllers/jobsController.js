import mongoose from 'mongoose'
import moment from 'moment'
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
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user._id) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])

  stats = stats.reduce((acc, curr) => {
    acc[curr._id] = curr.count
    return acc
  }, {})

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  }
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user._id) } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        '_id.year': -1,
        '_id.month': -1,
      },
    },
    { $limit: 6 },
  ])
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y')
      return { date, count }
    })
    .reverse()
  console.log(monthlyApplications)
  res.status(200).json({ defaultStats, monthlyApplications })
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
