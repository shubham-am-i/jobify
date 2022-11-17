import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Landing from './pages/Landing'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<div>Dashboard</div>} />
        <Route path='/landing' element={<Landing />} />
        <Route path='/register' element={<div>Register</div>} />
        <Route path='*' element={<h1>Error</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
