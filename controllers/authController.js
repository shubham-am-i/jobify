// import Model
import User from '../models/userModel.js'

import ErrorResponse from '../utils/errorResponse.js'

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

export const login = async (req, res) => {
  res.send('LOGIN user')
}
export const updateUser = async (req, res) => {
  res.send('UPDATE user')
}
