import ErrorResponse from '../utils/errorResponse.js'
import User from '../models/userModel.js' // import Model

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res) => {
  const { name, email, password } = req.body

  // Form validation for empty fields
  if (!name || !email || !password) {
    throw new ErrorResponse('Please provide all values', 400)
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    // res.status(400)
    // throw new Error('User already exists')
    throw new ErrorResponse(
      'Someone on this planet had already taken this email',
      400
    )
  }

  const user = await User.create({
    name,
    email,
    password,
  })
  const token = user.createJWT()
  res.status(201).json({ user, token })
}

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new ErrorResponse('Please provide all values', 400)
  }
  const user = await User.findOne({ email }).select('+password')

  if (user && (await user.matchPassword(password))) {
    const token = user.createJWT()
    user.password = undefined
    res.status(201).json({ user, token, location: user.location })
  } else {
    throw new ErrorResponse('Invalid Credentials', 401)
  }
}

// @desc    Update user
// @route   POST /api/v1/auth/updateUser
// @access  Private
export const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body
  if (!name || !email || !lastName || !location) {
    throw new ErrorResponse('Please provide all values', 400)
  }
  const user = await User.findOne({ _id: req.user._id })
  user.email = email
  user.name = name
  user.lastName = lastName
  user.location = location

  await user.save()
  const token = user.createJWT() //re-generate token
  res.status(200).json({ user, token, location: user.location })
}
