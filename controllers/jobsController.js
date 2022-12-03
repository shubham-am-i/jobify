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
  const { status, jobType, sort, search } = req.query

  const queryObject = {
    createdBy: req.user._id,
  }

  // add stuff based on condition
  if (status !== 'all') queryObject.status = status
  if (jobType !== 'all') queryObject.jobType = jobType
  if (search) queryObject.position = { $regex: search, $options: 'i' }

  let result = Job.find(queryObject)

  // chain sort conditions
  if (sort === 'latest') result = result.sort('-createdAt')
  if (sort === 'oldest') result = result.sort('createdAt')
  if (sort === 'a-z') result = result.sort('position')
  if (sort === 'z-a') result = result.sort('-position')

  // setup pagination
  const page = +req.query.page || 1
  const limit = +req.query.limit || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  const jobs = await result

  const totalJobs = await Job.countDocuments(queryObject)
  const numOfPages = Math.ceil(totalJobs / limit)
  res.status(200).json({
    totalJobs,
    numOfPages,
    jobs,
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
  res.status(200).json({ defaultStats, monthlyApplications })
}

// @desc    Update Job
// @route   PATCH /api/v1/jobs/:id
export const updateJob = async (req, res) => {
  const { id } = req.params
  const { position, company, jobLocation, jobType, status, portal } = req.body
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
    job.portal = portal
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
