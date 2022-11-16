import Landing from './pages/Landing'
import styled from 'styled-components'

const Button = styled.button`
  background: red;
  color: white;
  font-size: 1rem;
`

function App() {
  return (
    <div>
      <Button>Click Me</Button>
      <h1>Jobify</h1>
      <Landing />
    </div>
  )
}

export default App
