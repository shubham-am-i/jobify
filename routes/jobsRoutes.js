import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
// import controllers
import {
  getAllJobs,
  showStats,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobsController.js'

router.route('/').get(protect, getAllJobs).post(protect, createJob)
router.route('/stats').get(showStats) // this route should be always before id route
router.route('/:id').patch(updateJob).delete(deleteJob)

export default router
