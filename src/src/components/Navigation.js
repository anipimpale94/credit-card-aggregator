import React from 'react';
import '../styles/Navigation.css';

function Navigation({ currentPage, setCurrentPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">💳 Credit Card Aggregator</div>
        <ul className="navbar-nav">
          <li>
            <button
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentPage === 'connect' ? 'active' : ''}`}
              onClick={() => setCurrentPage('connect')}
            >
              Connect Bank
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
