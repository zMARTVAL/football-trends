import React from 'react';
import '../Styles/searchResults.css';

const SearchResults = ({ query = "g" }) => {
  const results = [
    { id: 1, title: "dissul yuKJI", description: "udUl lisa taizhi wi! gibbi gulis", percent: "4% درست", date: "2025-04-21" },
    { id: 2, title: "sulisig vde ikası vde gia daa uyta", percent: "7% درست", date: "2025-04-22" },
    { id: 3, title: "sig ulus gaz etik", percent: "2% درست", date: "2025-04-23" },
    { id: 4, title: "مدرب ضمنه يخلق على احتمال غياب رونالدو", percent: "9% درست", date: "2025-04-24" },
    { id: 5, title: "أفضل 5 أهداف في الدوري هذا الأسبوع", percent: "12% درست", date: "2025-04-25" },
    { id: 6, title: "تحليل: مستقبل كرة القدم العربية", percent: "5% درست", date: "2025-04-26" }
  ];

  return (
    <div className="search-results-container">
      <div className="search-results-header">
        <h1 className="results-title">
          نتائج البحث عن 
          <span className="highlight-container">
            <span className="highlight-bg"></span>
            <span className="highlight-text">{query}</span>
          </span>
        </h1>
      </div>
      
      <div className="news-grid">
        {results.map((item) => (
          <div key={item.id} className="news-card">
            <div className="news-header">
              <span className="news-badge">News</span>
              <span className="news-percent">{item.percent}</span>
            </div>
            
            <div className="news-content">
              <h3 className="news-title">{item.title}</h3>
              {item.description && (
                <p className="news-description">{item.description}</p>
              )}
              <div className="news-footer">
                <span className="news-date">{item.date}</span>
                <div className="news-reaction">
                  <span className="reaction-icon">👍</span>
                  <span className="reaction-count">{Math.floor(Math.random() * 100)}</span>
                </div>
              </div>
            </div>
            
            <div className="news-glow"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;