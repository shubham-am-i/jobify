import ErrorResponse from '../utils/errorResponse.js'

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  let message
  let error = { ...err }
  error.message = err.message

  // Log to console for dev
  // console.log(err)

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = `Resource not found`
    // Creating object from ErrorResponse class, can set custom status code instead of just 500.
    error = new ErrorResponse(message, 404) // not found
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    message = `${Object.keys(err.keyValue)} field has to be unique.`
    error = new ErrorResponse(message, 400) // bad request
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((val) => val.message)
    error = new ErrorResponse(message, 400)
  }

  // JWT tamper token error
  if (err.name === 'JsonWebTokenError') {
    message = `invalid signature: looks like JWT is tampered.`
    error = new ErrorResponse(message, 401)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    msg: error.message || 'Server Error',
  })
}

export { notFound, errorHandler }
