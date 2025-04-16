import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Explorer from "./pages/Explorer.jsx";
import Homepage from "./pages/Homepage.jsx";
import Main from "./pages/Main.jsx";
import Trends from "./pages/Trends.jsx";
import "./Styles/global.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="content-container">
         
          <div className="main-content">
            <Routes>
              <Route path="/" exact Component={Homepage}/>
              <Route path="/main" exact Component={Main}/>
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/homepage" element={<Homepage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;