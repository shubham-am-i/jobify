import React, { useReducer, useContext } from 'react'
import axios from 'axios'
import reducer from './reducer'

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: null,
  token: null,
  userLocation: '',
  jobLocation: '',
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const displayAlert = () => {
    dispatch({ type: 'DISPLAY_ALERT' })
    clearAlert()
  }

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: 'CLEAR_ALERT' })
    }, 3000)
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
      // local storage later
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

  return (
    <AppContext.Provider value={{ ...state, displayAlert, registerUser }}>
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => {
  return useContext(AppContext)
}
export { AppProvider, initialState, useAppContext }
