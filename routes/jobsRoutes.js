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
router.route('/stats').get(protect, showStats) // this route should be always before id route
router.route('/:id').patch(protect, updateJob).delete(protect, deleteJob)

export default router
