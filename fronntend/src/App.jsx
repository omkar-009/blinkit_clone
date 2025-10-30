import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar'
import Login from './pages/Register'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        {/* Routes */}
        <Routes>
          {/* <Route path="register" element={<Login />} /> */}
          <Route path="home" element={<Navbar />} />
        </Routes>

      </Router>
    </>
  )
}

export default App;
