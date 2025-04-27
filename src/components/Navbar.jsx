import React from "react";
import { Link, useLocation } from "react-router-dom";
import '../Styles/navbar.css';
import search from '../assets/images/search.png';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">
          <span className="brand-name">TrendSport</span>
          {location.pathname === "/" && <span className="brand-underline"></span>}
        </Link>
        
        <div className="search-container">
          <button className="search-button">
          <Link to="/TrendDashboard" >
            <img src={search} alt="Search" className="search-icon" />
            </Link>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;