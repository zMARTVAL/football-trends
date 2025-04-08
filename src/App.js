import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Main from "./pages/Main.jsx";
import Explorer from "./pages/Explorer.jsx";
import Trends from "./pages/Trends.jsx";
import "./Styles/global.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="content-container">
          <Sidebar isOpen={sidebarOpen} />
          <div className="main-content">
            <Routes>
              <Route path="/" exact Component={Main}/>
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/trends" element={<Trends />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;