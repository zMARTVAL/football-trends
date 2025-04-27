import React, { useRef, useState } from 'react';
import '../Styles/hero.css';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    // Logique de recherche
    console.log("Recherche:", searchQuery);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

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
        
        {/* Barre de recherche créative */}
        <div className={`search-creative-container ${isFocused ? 'focused' : ''}`}>
          <form onSubmit={handleSearch} className="search-creative">
            <div className="search-magnetic-field">
              <div className="search-orbits">
                <div className="orbit-circle orbit-1"></div>
                <div className="orbit-circle orbit-2"></div>
                <div className="orbit-circle orbit-3"></div>
              </div>
              
              <input
                ref={inputRef}
                type="text"
                placeholder="...ابحث عن أخبار، فرق، أو لاعبين"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="search-creative-input"
                dir="rtl"
              />
              
              <button 
                type="submit" 
                className="search-creative-button"
                aria-label="Rechercher"
              >
                <div className="search-icon-wrapper">
                  <svg className="search-icon" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                  <div className="search-pulse"></div>
                </div>
              </button>
            </div>
            
            <div className="search-suggestions">
              <span className="suggestion-chip">كرة القدم</span>
              <span className="suggestion-chip">الدوري السعودي</span>
              <span className="suggestion-chip">مباريات اليوم</span>
              <span className="suggestion-chip">تصفيات آسيا</span>
            </div>
          </form>
        </div>
        
       
      </div>
      
      <div className="hero-decorations">
        <div className="decor-circle blue"></div>
        <div className="search-particles">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="particle" style={{
              '--delay': `${i * 0.1}s`,
              '--size': `${Math.random() * 6 + 4}px`,
              '--distance': `${Math.random() * 40 + 60}px`,
              '--angle': `${Math.random() * 360}deg`
            }}></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;