import ErrorResponse from './errorResponse.js'

// This function check if the login user id is same as createdBy field in Job Model
export const isOwner = (requestUser, resourceUserId) => {
  if (requestUser._id.valueOf() == resourceUserId.valueOf()) {
    return
  }

  throw new ErrorResponse('Not authorized to access this route', 401)
}
