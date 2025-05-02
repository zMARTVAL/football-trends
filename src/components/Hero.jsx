import React, { useState, useRef,useEffect } from 'react';
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
        
        {/* Barre de recherche créative */}
  
        
       
      </div>
      
      {showResults && (
  <div className="search-results-container" style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#f8f9fa',
    padding: '2rem',
    fontFamily: "'Tajawal', sans-serif",
    width: '100%'
  }}>
    {isSearching ? (
      <div className="search-loading">
        <div className="spinner"></div>
        <p>Searching...</p>
      </div>
    ) : searchResults.length > 0 ? (
      <>
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          width: '100%',
          maxWidth: '1200px'
        }}>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: '0',
            display: 'inline-block',
            position: 'relative'
          }}>
            نتائج البحث عن 
            <span style={{
              position: 'relative',
              display: 'inline-block',
              marginRight: '10px'
            }}>
              <span style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '100%',
                height: '45%',
                backgroundColor: '#0047FF',
                opacity: '0.7',
                transform: 'rotate(-1.9deg)',
                zIndex: '0',
                animation: 'highlightExpand 0.8s ease-out 0.3s forwards',
                transformOrigin: 'left'
              }}></span>
              <span style={{
                position: 'relative',
                fontWeight: '600',
                zIndex: '1',
                padding: '0 5px'
              }}>{searchQuery}</span>
            </span>
          </h1>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '2rem',
          width: '100%',
          maxWidth: '1200px'
        }}>
          {searchResults.map((result, index) => (
            <div 
              key={index} 
              style={{
                position: 'relative',
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 10px 30px rgba(0, 71, 255, 0.1)',
                overflow: 'hidden',
                transition: 'all 0.4s ease',
                zIndex: '1',
                border: '1px solid rgba(0, 71, 255, 0.1)',
                animation: `float 6s ease-in-out infinite ${index * 0.1}s`
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <span style={{
                  background: result.source === 'news' 
                    ? 'linear-gradient(135deg, #0047FF, #00B2FF)' 
                    : 'linear-gradient(135deg, #FF0000, #FF5E5E)',
                  color: 'white',
                  padding: '6px 15px',
                  borderRadius: '50px',
                  fontSize: '0.8rem',
                  fontWeight: '700'
                }}>
                  {result.source === 'news' ? 'أخبار' : 'يوتيوب'}
                </span>
                
              </div>
              
              <div style={{
                textAlign: 'right',
                direction: 'rtl'
              }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  margin: '0 0 1rem 0',
                  lineHeight: '1.5'
                }}>
                  {result.url ? (
                    <a href={result.url} target="_blank" rel="noopener noreferrer" style={{
                      color: 'inherit',
                      textDecoration: 'none'
                    }}>
                      {result.title}
                    </a>
                  ) : (
                    result.title
                  )}
                </h3>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                  paddingTop: '1rem'
                }}>
                  <span style={{
                    fontSize: '0.85rem',
                    color: '#666'
                  }}>{result.date}</span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'rgba(0, 0, 0, 0.03)',
                    padding: '5px 12px',
                    borderRadius: '50px'
                  }}>
                    
                  </div>
                </div>
              </div>
              
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(0, 71, 255, 0.1) 0%, rgba(0, 71, 255, 0) 70%)',
                zIndex: '-1',
                opacity: '0',
                transition: 'opacity 0.4s ease'
              }}></div>
            </div>
          ))}
        </div>
      </>
    ) : (
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        <p>لا توجد نتائج لـ "{searchQuery}"</p>
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