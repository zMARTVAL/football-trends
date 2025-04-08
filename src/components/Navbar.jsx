import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import '../Styles/navbar.css'

function Navbar({ toggleSidebar }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          🏠 الرئيسية
          </Link>
        </li>
        <li>
          <Link to="/trends" className={location.pathname === "/trends" ? "active" : ""}>
          📰 آخر الأخبار
          </Link>
        </li>
        <li>
          <Link to="/analyses" className={location.pathname === "/analyses" ? "active" : ""}>
          📈 التحليلات
          </Link>
        </li>
        <li>
        <Link to="/clubs" className={location.pathname === "/clubs" ? "active" : ""}>
        ⚽ الفرق و اللاعبون
        </Link>
        </li>
      </ul>
      <div className="search-container">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="بحث..." className="search-bar" />
      </div>
      <div className="menu-container">
      <div
  style={{
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "24px",
    color: "#FFAD00",
    textShadow: `
      -1px -1px 0 #000,  
      1px -1px 0 #000,
      -1px 1px 0 #000,
      1px 1px 0 #000
    `,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }}
>
  ⚽ Football Trends
</div>
        <button className="menu-button" onClick={toggleSidebar}>☰ </button>
      </div>
    </nav>
  );
}

export default Navbar;

