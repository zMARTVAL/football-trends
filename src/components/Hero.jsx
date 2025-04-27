import React, { useState, useRef,useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import '../Styles/hero.css';
import { Bar } from 'react-chartjs-2';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowResults(false); // Hide previous results while loading
    
    try {
      const response = await axios.post('http://localhost:8000/api/search_articles', {
        search_term: searchQuery,
        days: 30,
        source: null,
        limit: 20
      });

      setSearchResults(response.data.results || []);
      setShowResults(true);
      
    } catch (error) {
      console.error("Search error:", error.response?.data || error.message);
      setSearchResults([]);
      setShowResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionSearch = async (suggestion) => {
    setSearchQuery(suggestion);
    setIsSearching(true);
    setShowResults(false);
    
    try {
      const response = await axios.post('http://localhost:8000/api/search_articles', {
        search_term: suggestion,
        days: 30,
        source: null,
        limit: 20
      });

      setSearchResults(response.data.results || []);
      setShowResults(true);
      
    } catch (error) {
      console.error("Suggestion search error:", error.response?.data || error.message);
      setSearchResults([]);
      setShowResults(true);
    } finally {
      setIsSearching(false);
    }
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
              <span 
                className="suggestion-chip"
                onClick={() => handleSuggestionSearch('كرة القدم')}
              >
                كرة القدم
              </span>
              <span 
                className="suggestion-chip"
                onClick={() => handleSuggestionSearch('رونالدو')}
              >
                رونالدو
              </span>
              <span 
                className="suggestion-chip"
                onClick={() => handleSuggestionSearch('مباريات اليوم')}
              >
                مباريات اليوم
              </span>
              <span 
                className="suggestion-chip"
                onClick={() => handleSuggestionSearch('تصفيات آسيا')}
              >
                تصفيات آسيا
              </span>
            </div>
          </form>
        </div>
        
        <div className="hero-cta">
          <Link to="/TrendDashboard">
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
      
      {showResults && (
          <div className="search-results-container">
            {isSearching ? (
              <div className="search-loading">
                <div className="spinner"></div>
                <p>Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <h3 className="results-title">Search Results for "{searchQuery}"</h3>
                <div className="results-grid">
                  {searchResults.map((result, index) => (
                    <div key={index} className="article-card">
                      <div className="card-header">
                        <span className={`source-badge ${result.source}`}>
                          {result.source}
                        </span>
              
                      </div>
                      <div className="card-body">
                        <h4 className="card-title">
                          {result.url ? (
                            <a href={result.url} target="_blank" rel="noopener noreferrer">
                              {result.title}
                            </a>
                          ) : (
                            result.title
                          )}
                        </h4>
                        <p className="card-date">{result.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-results">
                <p>No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}


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