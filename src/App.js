import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import TrendDashboard from "./components/TrendDashboard";
import Homepage from "./pages/Homepage.jsx";
import PredictionPage from "./pages/PredictionPage";
import confidenceIndicator from "./components/ConfidenceIndicator.jsx"
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
              
              <Route path="/TrendDashboard" exact Component={TrendDashboard}/>
              <Route path="/TrendPredictor" exact Component={PredictionPage}/>
              <Route path="/homepage" element={<Homepage />} />
              
            
              <Route path="/PredictionPage" element={<PredictionPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;