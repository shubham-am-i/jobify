import express from 'express'
import rateLimiter from 'express-rate-limit'
import { protect } from '../middlewares/authMiddleware.js'
import { register, login, updateUser } from '../controllers/authController.js'

const router = express.Router()

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many request from this IP address. Please try again later.',
})

router.route('/register').post(apiLimiter, register)
router.route('/login').post(apiLimiter, login)
router.route('/updateUser').patch(protect, updateUser)

export default router
