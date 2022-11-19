const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'DISPLAY_ALERT':
      return {
        ...state,
        showAlert: true,
        alertType: 'danger',
        alertText: 'Please provide all values!',
      }

    case 'CLEAR_ALERT': {
      return {
        ...state,
        showAlert: false,
        alertType: '',
        alertText: '',
      }
    }

    case 'REGISTER_USER_BEGIN': {
      return { ...state, isLoading: true }
    }
    case 'REGISTER_USER_SUCCESS': {
      const { token, user, location } = payload
      return {
        ...state,
        isLoading: false,
        token,
        user,
        userLocation: location,
        jobLocation: location,
        showAlert: true,
        alertType: 'success',
        alertText: 'User Created! Redirecting...',
      }
    }
    case 'REGISTER_USER_ERROR': {
      const { msg } = payload
      return {
        ...state,
        isLoading: false,
        showAlert: true,
        alertType: 'danger',
        alertText: msg,
      }
    }

    default:
      throw new Error(`no such action : ${type}`)
  }
}

export default reducer
