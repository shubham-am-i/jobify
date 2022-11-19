import express from 'express'
const router = express.Router()

// import controllers
import {
  getAllJobs,
  showStats,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobsController.js'

router.route('/').get(getAllJobs).post(createJob)
router.route('/stats').get(showStats) // this route should be always before id route
router.route('/:id').patch(updateJob).delete(deleteJob)

export default router
