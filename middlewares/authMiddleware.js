import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import ErrorResponse from '../utils/errorResponse.js'

export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // console.log(decoded)
    req.user = await User.findById(decoded.id).select('-password')
    next()
    // async error is active. Refer errorMiddleware with err.name = JsonWebTokenError
  }

  if (!token) {
    throw new ErrorResponse('Not authorized, no token', 401)
  }
}
