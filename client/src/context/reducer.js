import { initialState } from './appContext'

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
    case 'LOGIN_USER_BEGIN': {
      return { ...state, isLoading: true }
    }
    case 'LOGIN_USER_SUCCESS': {
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
        alertText: 'Login Successful! Redirecting...',
      }
    }
    case 'LOGIN_USER_ERROR': {
      const { msg } = payload
      return {
        ...state,
        isLoading: false,
        showAlert: true,
        alertType: 'danger',
        alertText: msg,
      }
    }

    case 'TOGGLE_SIDEBAR': {
      return { ...state, showSidebar: !state.showSidebar }
    }

    case 'LOGOUT_USER': {
      return {
        ...initialState,
        user: null,
        token: null,
        jobLocation: '',
        userLocation: '',
      }
    }

    case 'UPDATE_USER_BEGIN': {
      return { ...state, isLoading: true }
    }
    case 'UPDATE_USER_SUCCESS': {
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
        alertText: 'User Profile Updated!',
      }
    }
    case 'UPDATE_USER_ERROR': {
      const { msg } = payload
      return {
        ...state,
        isLoading: false,
        showAlert: true,
        alertType: 'danger',
        alertText: msg,
      }
    }
    case 'HANDLE_CHANGE': {
      const { name, value } = payload
      return {
        ...state,
        [name]: value,
      }
    }

    case 'CLEAR_VALUES': {
      const initialState = {
        isEditing: false,
        editJobId: '',
        position: '',
        company: '',
        jobLocation: state.userLocation,
        jobType: 'full-time',
        status: 'pending',
      }
      return {
        ...state,
        ...initialState,
      }
    }

    case 'CREATE_JOB_BEGIN': {
      return { ...state, isLoading: true }
    }

    case 'CREATE_JOB_SUCCESS': {
      return {
        ...state,
        isLoading: false,
        showAlert: true,
        alertType: 'success',
        alertText: 'New Job Created!',
      }
    }
    case 'CREATE_JOB_ERROR': {
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
