import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import '../Styles/navbar.css'
import search from '../assets/images/search.png';

function Navbar() {

  const location = useLocation();



  return (
    <nav className="navbar">
      <div className="left-nav">


      <ul className="nav-links">
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            الرئيسية
          </Link>
        </li>
        <li>
          <Link to="/trends" className={location.pathname === "/trends" ? "active" : ""}>
            آخر الأخبار
          </Link>
        </li>
        <li>
          <Link to="/analyses" className={location.pathname === "/analyses" ? "active" : ""}>
            التحليلات
          </Link>
        </li>
        </ul>
        </div>

        <div className="right-nav">
        <ul className="nav-links">
        <li>
          <Link to="/clubs" className={location.pathname === "/clubs" ? "active" : ""}>
            الفرق و اللاعبون
          </Link>
        </li>
        <li>
          <Link to="/analyses" className={location.pathname === "/analyses" ? "active" : ""}>
            التحليلات
          </Link>
        </li>
        <li>
          <Link to="#" className="search-icon">
            <img src={search} alt="Search" className="photo-nav" />
          </Link>
        </li>
      </ul>
      </div>
    </nav>
  );
}

export default Navbar;
