import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import HomePage from './HomePage';
import './App.css'

export default function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
        </nav>
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}
