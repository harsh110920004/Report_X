import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="navbar">
      <h1> Incident Report </h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/help">Help</Link> {/* NEW */}
        {isLoggedIn ? (
          <>
            <Link to="/track">Track Report</Link>
            <Link to="/my-reports">My Reports</Link>
            {user.role === 'admin' && <Link to="/admin">Admin Dashboard</Link>}
            <span style={{ marginLeft: '1rem', color: '#667eea' }}>
              Hello, {user.name}
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;

