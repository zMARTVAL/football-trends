import React from 'react';
import { Link } from "react-router-dom";
import '../Styles/hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="title-spacer"></div>
        
        <h1 className="hero-title">
          اكتشف آخر الترندات الرياضية العربية  
          <br />
          <span className="highlight-container">
            <span className="highlight-bg"></span>
            <span className="highlight-text">TrendSport</span>
          </span>
        </h1>
        
        <div className="hero-cta">
        <Link to="/TrendDashboard" >
          <button className="cta-button">ابدأ الآن</button>
          </Link>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">+2000</div>
              <div className="stat-label">مقالة رياضية</div>
            </div>
            <div className="divider"></div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">تغطية مستمرة</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hero-decorations">
        <div className="decor-circle blue"></div>
      </div>
    </section>
  );
};

export default Hero;