import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import './TrendDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale
);

const TrendDashboard = () => {
  const [topic, setTopic] = useState('');
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [compareTopics, setCompareTopics] = useState([]);
  const [error, setError] = useState('');
  const [isValidTopic, setIsValidTopic] = useState(false);
  const [view, setView] = useState('basic'); // 'basic' or 'advanced'

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (topic) {
      checkTopicValidity();
    }
  }, [topic]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/top_categories');
      const result = await response.json();
      setCategories(result.categories);
      if (result.categories.length > 0) {
        setTopic(result.categories[0]);
        setCompareTopics([result.categories[0], result.categories[1] || result.categories[0]]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  };

  const checkTopicValidity = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/check_topic/${encodeURIComponent(topic)}`);
      const result = await response.json();
      setIsValidTopic(result.exists);
      if (!result.exists) {
        setError('This topic is not in our database. Please try another term.');
      } else {
        setError('');
      }
    } catch (error) {
      console.error('Error checking topic:', error);
      setIsValidTopic(false);
      setError('Error validating topic');
    }
  };

  const fetchData = async () => {
    if (!topic || !isValidTopic) return;
    
    setLoading(true);
    setError('');
    try {
      const endpoint = compareMode ? '/api/compare' : 
                      view === 'advanced' ? '/api/advanced_analysis' : '/api/trends';
      
      const body = compareMode ? 
        { topics: compareTopics, days } : 
        { target_class: topic, days };
      
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch data');
      }
      
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTimeSeriesChart = () => {
    if (!data) return null;

    if (compareMode) {
      const datasets = Object.keys(data).map((topic, idx) => ({
        label: topic,
        data: data[topic].time_series.counts,
        borderColor: `hsl(${idx * 120}, 70%, 50%)`,
        backgroundColor: `hsla(${idx * 120}, 70%, 50%, 0.2)`,
        tension: 0.1
      }));

      return (
        <Line
          data={{
            labels: data[compareTopics[0]].time_series.dates,
            datasets: datasets
          }}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Interest Over Time (Comparison)',
                font: { size: 16 }
              },
            },
            scales: {
              x: {
                title: { display: true, text: 'Date' }
              },
              y: {
                title: { display: true, text: 'Mentions' }
              }
            }
          }}
        />
      );
    } else {
      return (
        <Line
          data={{
            labels: data.time_series.dates,
            datasets: [{
              label: 'Mentions',
              data: data.time_series.counts,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.1
            }]
          }}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: `Interest Over Time for ${topic}`,
                font: { size: 16 }
              },
            },
            scales: {
              x: {
                title: { display: true, text: 'Date' }
              },
              y: {
                title: { display: true, text: 'Mentions' }
              }
            }
          }}
        />
      );
    }
  };


  const renderTopTermsChart = () => {
    // Check for both possible data structures (basic trends and advanced analysis)
    const trends = data?.trends || data?.basic_trends;
    
    if (!trends || trends.length === 0 || compareMode) {
      return <div className="no-data">No trends data available</div>;
    }
  
    const topTerms = trends.slice(0, 10);
    
    return (
      <Bar
        data={{
          labels: topTerms.map(t => t.term),
          datasets: [{
            label: 'Relevance Score',
            data: topTerms.map(t => t.score),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        }}
        options={{
          indexAxis: 'y',
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Top Related Terms',
              font: { size: 16 }
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              title: { display: true, text: 'Score' }
            }
          }
        }}
      />
    );
  };


  const renderSentimentChart = () => {
    if (!data?.sentiment || Object.keys(data.sentiment).length === 0) {
      return <div className="no-data">No sentiment data available</div>;
    }

    return (
      <Pie
        data={{
          labels: Object.keys(data.sentiment).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
          datasets: [{
            data: Object.values(data.sentiment),
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(255, 206, 86, 0.6)'
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }]
        }}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Sentiment Distribution',
              font: { size: 16 }
            },
          }
        }}
      />
    );
  };

  const renderEntities = () => {
    if (!data?.named_entities?.by_type || Object.keys(data.named_entities.by_type).length === 0) {
      return <div className="no-data">No named entities data available</div>;
    }

    return (
      <div className="entities-section">
        <h3>Named Entities</h3>
        <div className="entities-grid">
          {Object.entries(data.named_entities.by_type).map(([type, entities]) => (
            <div key={type} className="entity-type">
              <h4>{type}</h4>
              <ul>
                {Object.entries(entities).map(([entity, count]) => (
                  <li key={entity}>
                    <span className="entity-text">{entity}</span>
                    <span className="entity-count">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCoOccurrence = () => {
    if (!data?.named_entities?.co_occurrence || data.named_entities.co_occurrence.length === 0) {
      return <div className="no-data">No co-occurrence data available</div>;
    }

    return (
      <div className="co-occurrence">
        <h3>Entity Relationships</h3>
        <table>
          <thead>
            <tr>
              <th>Entity 1</th>
              <th>Entity 2</th>
              <th>Co-occurrences</th>
            </tr>
          </thead>
          <tbody>
            {data.named_entities.co_occurrence.map((item, index) => (
              <tr key={index}>
                <td>{item.entity1} ({item.type1})</td>
                <td>{item.entity2} ({item.type2})</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSummary = () => {
    if (!data?.summary) return null;

    return (
      <div className="summary-card">
        <h3>Summary</h3>
        <div className="summary-stats">
          <div className="stat">
            <div className="stat-value">{data.summary.total_articles || 0}</div>
            <div className="stat-label">Total Articles</div>
          </div>
          <div className="stat">
            <div className="stat-value">{data.summary.unique_terms || 0}</div>
            <div className="stat-label">Unique Terms</div>
          </div>
          <div className="stat">
            <div className="stat-value">{data.summary.avg_similarity?.toFixed(2) || 0}</div>
            <div className="stat-label">Avg Similarity</div>
          </div>
        </div>
      </div>
    );
  };

  const renderComparisonSummary = () => {
    if (!data || !compareMode) return null;

    return (
      <div className="comparison-table">
        <h3>Comparison Summary</h3>
        <table>
          <thead>
            <tr>
              <th>Topic</th>
              <th>Total Mentions</th>
              <th>Sentiment</th>
              <th>Top Terms</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map(topic => (
              <tr key={topic}>
                <td>{topic}</td>
                <td>{data[topic].total_mentions}</td>
                <td>
                  {data[topic].sentiment ? (
                    Object.entries(data[topic].sentiment).map(([k, v]) => (
                      <span key={k} className={`sentiment-${k}`}>
                        {k}: {v}{' '}
                      </span>
                    ))
                  ) : 'N/A'}
                </td>
                <td>{data[topic].top_terms.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleCompareTopicChange = (index, value) => {
    const newTopics = [...compareTopics];
    newTopics[index] = value;
    setCompareTopics(newTopics);
  };

  const addCompareTopic = () => {
    if (compareTopics.length < 4 && categories.length > 0) {
      setCompareTopics([...compareTopics, categories[0]]);
    }
  };

  const removeCompareTopic = (index) => {
    if (compareTopics.length > 2) {
      const newTopics = [...compareTopics];
      newTopics.splice(index, 1);
      setCompareTopics(newTopics);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="app">
      <header>
        <h1>Arabic Trends Analyzer</h1>
        <p>Analyze trends and sentiment in Arabic news content</p>
      </header>

      <form className="controls" onSubmit={handleSubmit}>
        <div className="control-group">
          <label>Analysis Mode:</label>
          <div className="toggle-switch">
            <button
              type="button"
              className={!compareMode ? 'active' : ''}
              onClick={() => setCompareMode(false)}
            >
              Single Topic
            </button>
            <button
              type="button"
              className={compareMode ? 'active' : ''}
              onClick={() => setCompareMode(true)}
            >
              Compare Topics
            </button>
          </div>
        </div>

        {!compareMode ? (
          <>
            <div className="control-group">
              <label htmlFor="topic-input">Topic:</label>
              <div className="topic-input-container">
                <input
                  id="topic-input"
                  type="text"
                  value={topic}
                  onChange={handleTopicChange}
                  placeholder="Enter a topic in Arabic"
                  list="topic-suggestions"
                />
                <datalist id="topic-suggestions">
                  {categories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
              {!isValidTopic && topic && (
                <div className="error-message">{error}</div>
              )}
            </div>

            <div className="control-group">
              <label>View Mode:</label>
              <div className="toggle-switch">
                <button
                  type="button"
                  className={view === 'basic' ? 'active' : ''}
                  onClick={() => setView('basic')}
                >
                  Basic
                </button>
                <button
                  type="button"
                  className={view === 'advanced' ? 'active' : ''}
                  onClick={() => setView('advanced')}
                >
                  Advanced
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="control-group compare-topics">
            <label>Topics to Compare:</label>
            <div className="topic-selectors">
              {compareTopics.map((topic, idx) => (
                <div key={idx} className="topic-selector">
                  <select
                    value={topic}
                    onChange={(e) => handleCompareTopicChange(idx, e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {compareTopics.length > 2 && (
                    <button 
                      type="button"
                      className="remove-topic"
                      onClick={() => removeCompareTopic(idx)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button"
                className="add-topic"
                onClick={addCompareTopic}
                disabled={compareTopics.length >= 4 || categories.length === 0}
              >
                + Add Topic
              </button>
            </div>
          </div>
        )}

        <div className="control-group">
          <label>Time Period:</label>
          <select 
            value={days} 
            onChange={(e) => setDays(parseInt(e.target.value))}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 3 Months</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="analyze-btn"
          disabled={(!isValidTopic && !compareMode) || loading}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      )}

      {error && !loading && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {data && !loading && !error && (
        <div className="dashboard">
          <div className="chart-container">
            {renderTimeSeriesChart()}
          </div>

          {!compareMode && view === 'advanced' && (
            <>
              <div className="row">
                <div className="chart-container">
                  {renderTopTermsChart()}
                </div>
                <div className="chart-container">
                  {renderSentimentChart()}
                </div>
              </div>

              {renderSummary()}
              <div className='section'>
              {!compareMode && data && (
  <div className="terms-table">
    <h3>Detailed Term Analysis</h3>
    <table>
      <thead>
        <tr>
          <th>Term</th>
          <th>Frequency</th>
          <th>Similarity</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {(data.trends || data.basic_trends || []).map((term, idx) => (
          <tr key={idx}>
            <td>{term.term}</td>
            <td>{term.frequency}</td>
            <td>{term.similarity.toFixed(2)}</td>
            <td>{term.score.toFixed(1)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

              </div>
    
              <div className="section">
                <h2>Named Entities Analysis</h2>
                {renderEntities()}
                {renderCoOccurrence()}
              </div>
            </>
          )}


          {compareMode && renderComparisonSummary()}
        </div>
      )}
    </div>
  );
};

export default TrendDashboard;