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
  showSidebar: false,
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobLocation: userLocation || '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  statusOptions: ['interview', 'declined', 'pending'],
  status: 'pending',
  portal: 'Coding Ninjas',
  portalOptions: [
    'Coding Ninjas',
    'LinkedIn',
    'Internshala',
    'Naukri',
    'Hirist',
    'Hirect',
    'Careers',
    'Other',
  ],
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
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
      if (error.response.status === 401) {
        logoutUser()
      }
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
      if (error.response.status !== 401) {
        dispatch({
          type: 'UPDATE_USER_ERROR',
          payload: { msg: error.response.data.msg },
        })
      }
    }
    clearAlert()
  }

  const handleChange = ({ name, value }) => {
    dispatch({ type: 'HANDLE_CHANGE', payload: { name, value } })
  }

  const clearValues = () => {
    dispatch({ type: 'CLEAR_VALUES' })
  }

  const createJob = async () => {
    dispatch({ type: 'CREATE_JOB_BEGIN' })
    try {
      const { position, company, jobLocation, jobType, status, portal } = state
      await authFetch.post('/jobs', {
        position,
        company,
        jobLocation,
        jobType,
        status,
        portal,
      })
      dispatch({ type: 'CREATE_JOB_SUCCESS' })
      dispatch({ type: 'CLEAR_VALUES' })
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: 'CREATE_JOB_ERROR',
          payload: { msg: error.response.data.msg },
        })
      }
    }
    clearAlert()
  }

  const getJobs = async () => {
    const { page, search, searchStatus, searchType, sort } = state

    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
    if (search) url += `&search=${search}`

    dispatch({ type: 'GET_JOBS_BEGIN' })
    try {
      const { data } = await authFetch.get(url)
      const { jobs, totalJobs, numOfPages } = data
      dispatch({
        type: 'GET_JOBS_SUCCESS',
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      })
    } catch (error) {
      logoutUser()
    }
    clearAlert()
  }

  const setEditJob = (id) => {
    dispatch({ type: 'SET_EDIT_JOB', payload: { id } })
  }
  const editJob = async () => {
    dispatch({ type: 'EDIT_JOB_BEGIN' })
    try {
      const { position, company, jobLocation, jobType, status, portal } = state
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
        portal,
      })
      dispatch({ type: 'EDIT_JOB_SUCCESS' })
      dispatch({ type: 'CLEAR_VALUES' })
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({
        type: 'EDIT_jOB_ERROR',
        payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }

  const deleteJob = async (id) => {
    dispatch({ type: 'DELETE_JOB_BEGIN' })
    try {
      await authFetch.delete(`/jobs/${id}`)
      getJobs()
    } catch (error) {
      logoutUser()
    }
  }

  const showStats = async () => {
    dispatch({ type: 'SHOW_STATS_BEGIN' })
    try {
      const { data } = await authFetch('/jobs/stats')
      dispatch({
        type: 'SHOW_STATS_SUCCESS',
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      })
    } catch (error) {
      logoutUser()
    }
    clearAlert()
  }

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' })
  }

  const changePage = (page) => {
    dispatch({ type: 'CHANGE_PAGE', payload: { page } })
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
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
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
