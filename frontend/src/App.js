import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import TrackReport from './components/TrackReport';
import MyReports from './pages/MyReports';
import Help from './pages/Help'; // NEW
import './App.css';

function App() {
  const isLoggedIn = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Redirect to home if logged in, otherwise to login */}
          <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />

          {/* Redirect to home if already logged in */}
          <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/" />} />

          {/* Publicly accessible */}
          <Route 
            path="/track" 
            element={
              <div className="container">
                <TrackReport />
              </div>
            } 
          />

          {/* Authenticated users only */}
          <Route 
            path="/my-reports" 
            element={isLoggedIn ? <MyReports /> : <Navigate to="/login" />} 
          />

          {/* Admin access only */}
          <Route 
            path="/admin" 
            element={isLoggedIn && user.role === 'admin' ? <Admin /> : <Navigate to="/" />} 
          />

          {/* Public Help page */}
          <Route path="/help" element={<Help />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
