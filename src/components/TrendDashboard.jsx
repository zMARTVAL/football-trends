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
import '../Styles/TrendDashboard.css';

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
  const [error, setError] = useState('');
  const [isValidTopic, setIsValidTopic] = useState(false);
  const [selectedDate, setSelectedDate] = useState(0);
  const [topic2, setTopic2] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [compareMode, setCompareMode] = useState(false);

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
        setTopic2(result.categories[1] || result.categories[0]);
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
    if (compareMode) {
      if (!topic || !topic2) return;
      await fetchComparisonData();
    } else {
      if (!topic || !isValidTopic) return;
      await fetchSingleTopicData();
    }
  };

  const fetchSingleTopicData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8000/api/advanced_analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_class: topic,
          days: days
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch data');
      }
      
      const result = await response.json();
      setData(result);
      setComparisonData(null); // Clear comparison data when in single mode
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComparisonData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8000/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topics: [topic, topic2],
          days: days
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch comparison data');
      }
      
      const result = await response.json();
      setComparisonData(result);
      setData(null); // Clear single topic data when in compare mode
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleTopic2Change = (e) => {
    setTopic2(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const renderComparisonSummary = () => {
    if (!comparisonData) return null;

    return (
      <div className="comparison-section">
        <h2>Comparison Results</h2>
        
        <div className="comparison-cards">
          {Object.entries(comparisonData).map(([topic, topicData]) => (
            <div key={topic} className="comparison-card">
              <h3>{topic}</h3>
              <div className="comparison-stats">
                <div className="stat">
                  <div className="stat-value">{topicData.total_mentions}</div>
                  <div className="stat-label">Total Mentions</div>
                </div>
                <div className="stat">
                  <div className="stat-value">{topicData.news_mentions}</div>
                  <div className="stat-label">News Articles</div>
                </div>
                <div className="stat">
                  <div className="stat-value">{topicData.youtube_mentions}</div>
                  <div className="stat-label">YouTube Videos</div>
                </div>
                <div className="stat">
                  <div className="stat-value">{topicData.average_engagement?.toFixed(2) || 'N/A'}</div>
                  <div className="stat-label">Avg Engagement</div>
                </div>
              </div>
              
              <div className="comparison-terms">
                <h4>Top Terms:</h4>
                <ul>
                  {topicData.top_terms.map((term, idx) => (
                    <li key={idx}>{term}</li>
                  ))}
                </ul>
                
                <h4>Top YouTube Terms:</h4>
                <ul>
                  {topicData.top_youtube_terms.map((term, idx) => (
                    <li key={idx}>{term}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="comparison-chart">
          {renderComparisonChart()}
        </div>
      </div>
    );
  };

  const renderComparisonChart = () => {
    if (!comparisonData) return null;

    const topics = Object.keys(comparisonData);
    
    return (
      <Bar
        data={{
          labels: ['Total Mentions', 'News Mentions', 'YouTube Mentions', 'Avg Engagement'],
          datasets: topics.map((topic, idx) => ({
            label: topic,
            data: [
              comparisonData[topic].total_mentions,
              comparisonData[topic].news_mentions,
              comparisonData[topic].youtube_mentions,
              comparisonData[topic].average_engagement || 0
            ],
            backgroundColor: `hsl(${idx * 180}, 70%, 50%)`,
            borderColor: `hsl(${idx * 180}, 70%, 30%)`,
            borderWidth: 1
          }))
        }}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Topic Comparison Overview',
              font: { size: 16 }
            },
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }}
      />
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
          <div className="stat">
            <div className="stat-value">{data.summary.source_distribution?.news || 0}</div>
            <div className="stat-label">News Articles</div>
          </div>
          <div className="stat">
            <div className="stat-value">{data.summary.source_distribution?.youtube || 0}</div>
            <div className="stat-label">YouTube Videos</div>
          </div>
        </div>
      </div>
    );
  };

  const renderTopTermsChart = () => {
    const trends = data?.trends?.combined || [];
    
    if (!trends || trends.length === 0) {
      return <div className="no-data">No trends data available</div>;
    }
  
    const topTerms = trends.slice(0, 10);
    return (
      <div className="bar-chart-container">
        <Bar
          data={{
            labels: topTerms.map(t => t.term),
            datasets: [{
              label: 'Relevance Score',
              data: topTerms.map(t => t.combined_score),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          }}
          options={{
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Top Related Terms',
                font: { size: 16 }
              },
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                title: { 
                  display: true, 
                  text: 'Score',
                  font: {
                    weight: 'bold'
                  }
                }
              },
              y: {
                ticks: {
                  autoSkip: false
                }
              }
            }
          }}
        />
      </div>
    );
  };

  const renderTimeSeriesChart = () => {
    if (!data?.analysis?.time_series) return null;

    return (
      <div className="chart-container">
        <Line
          data={{
            labels: data.analysis.time_series.news.dates,
            datasets: [
              {
                label: 'News Mentions',
                data: data.analysis.time_series.news.counts,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
              },
              {
                label: 'YouTube Mentions',
                data: data.analysis.time_series.youtube.counts,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: `Activity Over Time for ${topic}`,
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
      </div>
    );
  };

  const renderSentimentChart = () => {
    if (!data?.analysis?.sentiment) return null;

    return (
      <div className="sentiment-chart-container">
        <Pie
          data={{
            labels: Object.keys(data.analysis.sentiment).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
            datasets: [{
              data: Object.values(data.analysis.sentiment),
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
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Sentiment Distribution',
                font: { size: 16 }
              },
            }
          }}
        />
      </div>
    );
  };

  const renderEntities = () => {
    if (!data?.analysis?.entities?.by_type) return null;

    return (
      <div className="entities-section">
        <h3>Named Entities</h3>
        <div className="entities-grid">
          {Object.entries(data.analysis.entities.by_type).map(([type, entities]) => (
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
    if (!data?.analysis?.entities?.co_occurrence) return null;

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
            {data.analysis.entities.co_occurrence.map((item, index) => (
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

  const renderCombinedTrends = () => {
    if (!data?.trends?.combined) return null;

    return (
      <div className="trends-section">
        <h2>Combined Trends</h2>
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-value">{data.stats.trend_stats.combined.count}</span>
            <span className="stat-label">Total Terms</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{data.stats.trend_stats.combined.avg_score.toFixed(2)}</span>
            <span className="stat-label">Avg Score</span>
          </div>
        </div>
        <div className="trends-table">
          <table>
            <thead>
              <tr>
                <th>Term</th>
                <th>Combined Score</th>
                <th>News Score</th>
                <th>YouTube Score</th>
                <th>News Freq</th>
                <th>YT Freq</th>
                <th>YT Engagement</th>
              </tr>
            </thead>
            <tbody>
              {data.trends.combined.map((trend, index) => (
                <tr key={index}>
                  <td>{trend.term}</td>
                  <td>{trend.combined_score.toFixed(2)}</td>
                  <td>{trend.news_data.score.toFixed(2)}</td>
                  <td>{trend.youtube_data.score.toFixed(2)}</td>
                  <td>{trend.news_data.frequency}</td>
                  <td>{trend.youtube_data.frequency}</td>
                  <td>{trend.youtube_data.engagement.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSourceSpecificTrends = () => {
    return (
      <div className="source-trends">
        <h2>Source-Specific Trends</h2>
        <div className="trend-columns">
          <div className="trend-column">
            <h3>News Only Trends</h3>
            <div className="stats-summary">
              <div className="stat-item">
                <span className="stat-value">{data.stats.trend_stats.news_only.count}</span>
                <span className="stat-label">Total Terms</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{data.stats.trend_stats.news_only.avg_score.toFixed(2)}</span>
                <span className="stat-label">Avg Score</span>
              </div>
            </div>
            <div className="trends-list">
              {data.trends.news_only.map((trend, index) => (
                <div key={index} className="trend-item">
                  <span className="term">{trend.term}</span>
                  <span className="score">{trend.score.toFixed(2)}</span>
                  <span className="frequency">{trend.frequency}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="trend-column">
            <h3>YouTube Only Trends</h3>
            <div className="stats-summary">
              <div className="stat-item">
                <span className="stat-value">{data.stats.trend_stats.youtube_only.count}</span>
                <span className="stat-label">Total Terms</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{data.stats.trend_stats.youtube_only.avg_score.toFixed(2)}</span>
                <span className="stat-label">Avg Score</span>
              </div>
            </div>
            <div className="trends-list">
              {data.trends.youtube_only.map((trend, index) => (
                <div key={index} className="trend-item">
                  <span className="term">{trend.term}</span>
                  <span className="score">{trend.score.toFixed(2)}</span>
                  
                  <span className="engagement">{trend.engagement_score.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <header>
        <h1>تحليل الترندات الرياضية بالعربية</h1>
        <p>اختر موضوعك وابدأ التحليل المتقدم للترندات في الأخبار والمحتوى الرياضي العربي</p>
      </header>

      <form className="controls" onSubmit={handleSubmit}>
        <div className="control-group">
          <label htmlFor="mode-toggle">Mode:</label>
          <div className="toggle-switch">
            <button
              type="button"
              className={!compareMode ? 'active' : ''}
              onClick={() => setCompareMode(false)}
            >
              موضوع واحد
            </button>
            <button
              type="button"
              className={compareMode ? 'active' : ''}
              onClick={() => setCompareMode(true)}
            >
              مقارنة المواضيع
            </button>
          </div>
        </div>

        <div className="control-group">
          <label htmlFor="topic-input">{compareMode ? 'First Topic:' : 'Topic:'}</label>
          <div className="topic-input-container">
            <input
              id="topic-input"
              type="text"
              value={topic}
              onChange={handleTopicChange}
              placeholder="الدوري الإنجليزي، كرة السلة"
              list="topic-suggestions"
            />
            <datalist id="topic-suggestions">
              {categories.map(cat => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
          {!compareMode && !isValidTopic && topic && (
            <div className="error-message">{error}</div>
          )}
        </div>

        {compareMode && (
          <div className="control-group">
            <label htmlFor="topic2-input">Second Topic:</label>
            <div className="topic-input-container">
              <input
                id="topic2-input"
                type="text"
                value={topic2}
                onChange={handleTopic2Change}
                placeholder="Enter second topic in Arabic"
                list="topic-suggestions"
              />
            </div>
          </div>
        )}

        <div className="control-group">
          <label>Time Period:</label>
          <select 
            value={days} 
            onChange={(e) => setDays(parseInt(e.target.value))}
          >
            <option value="7">آخر 7 أيام </option>
            <option value="30">آخر 30 يوم</option>
            <option value="90">آخر 3 أشهر</option>
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

      {!compareMode && data && !loading && !error && (
        <div className="dashboard">
          {/* Single topic view - keep all your existing render calls */}
          {renderTimeSeriesChart()}
          <div className="charts-row">
            {renderTopTermsChart()}
            {renderSentimentChart()}
          </div>
          {renderSummary()}
          {renderCombinedTrends()}
          {renderSourceSpecificTrends()}
          <div className="analysis-row">
            <div className="analysis-col">
              {renderEntities()}
              {renderCoOccurrence()}
            </div>
          </div>
        </div>
      )}

      {compareMode && comparisonData && !loading && !error && (
        <div className="dashboard">
          {/* Comparison view */}
          {renderComparisonSummary()}
          
          {/* You could add more comparison-specific visualizations here */}
          <div className="chart-container">
            {renderComparisonChart()}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendDashboard;