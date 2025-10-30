import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route — redirect to /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Home page with Navbar */}
        <Route path="/home" element={<Navbar />} />

        {/* Register page */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
