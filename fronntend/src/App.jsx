import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Login from './pages/Register'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      {/* <Login /> */}
    </>
  )
}

export default App;
