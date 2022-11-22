import React, { useReducer, useContext } from 'react'
import axios from 'axios'
import reducer from './reducer'

// get values from local storage
const user = localStorage.getItem('user')
const token = localStorage.getItem('token')
const userLocation = localStorage.getItem('location')

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  jobLocation: userLocation || '',
  showSidebar: false,
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // axios with config and interceptors
  const authFetch = axios.create({
    baseURL: '/api/v1',
  })
  // request interceptor
  authFetch.interceptors.request.use(
    (config) => {
      config.headers['Authorization'] = `Bearer ${state.token}`
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  // response interceptor
  authFetch.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  const displayAlert = () => {
    dispatch({ type: 'DISPLAY_ALERT' })
    clearAlert()
  }

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: 'CLEAR_ALERT' })
    }, 3000)
  }

  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    localStorage.setItem('location', location)
  }

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('location')
  }
  const registerUser = async (currentUser) => {
    try {
      dispatch({ type: 'REGISTER_USER_BEGIN' })
      const response = await axios.post('/api/v1/auth/register', currentUser)
      console.log(response)
      const { user, token, location } = response.data
      dispatch({
        type: 'REGISTER_USER_SUCCESS',
        payload: { user, token, location },
      })
      addUserToLocalStorage({ user, token, location })
    } catch (error) {
      dispatch({
        type: 'REGISTER_USER_ERROR',
        payload: {
          msg: error.response.data.msg,
        },
      })
    }
    clearAlert()
  }

  const loginUser = async (currentUser) => {
    try {
      dispatch({ type: 'LOGIN_USER_BEGIN' })
      const { data } = await axios.post('/api/v1/auth/login', currentUser)
      const { user, token, location } = data
      dispatch({
        type: 'LOGIN_USER_SUCCESS',
        payload: { user, token, location },
      })
      addUserToLocalStorage({ user, token, location })
    } catch (error) {
      dispatch({
        type: 'LOGIN_USER_ERROR',
        payload: {
          msg: error.response.data.msg,
        },
      })
    }
    clearAlert()
  }

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' })
  }

  const logoutUser = () => {
    dispatch({ type: 'LOGOUT_USER' })
    removeUserFromLocalStorage()
  }

  const updateUser = async (currentUser) => {
    dispatch({ type: 'UPDATE_USER_BEGIN' })
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser)
      const { user, location, token } = data
      dispatch({
        type: 'UPDATE_USER_SUCCESS',
        payload: { user, location, token },
      })
      addUserToLocalStorage({ user, location, token })
    } catch (error) {
      dispatch({
        type: 'UPDATE_USER_ERROR',
        payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }
  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        toggleSidebar,
        logoutUser,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => {
  return useContext(AppContext)
}
export { AppProvider, initialState, useAppContext }
