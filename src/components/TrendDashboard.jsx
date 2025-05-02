import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import './TrendDashboard.css';
import axios from 'axios';

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
      const response = await axios.get('http://localhost:8000/api/top_categories');
      setCategories(response.data.categories);
      if (response.data.categories.length > 0) {
        setTopic(response.data.categories[0]);
        setTopic2(response.data.categories[1] || response.data.categories[0]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  };

  const checkTopicValidity = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/check_topic/${encodeURIComponent(topic)}`);
      setIsValidTopic(response.data.exists);
      if (!response.data.exists) {
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
      const response = await axios.post('http://localhost:8000/api/advanced_analysis', {
        target_class: topic,
        days: days
      });
      
      setData(response.data);
      setComparisonData(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.response?.data?.detail || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComparisonData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/compare', {
        topics: [topic, topic2],
        days: days
      });
      
      setComparisonData(response.data);
      setData(null);
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      setError(error.response?.data?.detail || error.message);
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

  const ComparisonTimeSeries = ({ data, topics }) => {
    if (!data || !topics) return null;
  
    const datasets = topics.map((topic, idx) => ({
      label: topic,
      data: data.comparison[topic].time_series.news.counts,
      borderColor: `hsl(${idx * 120}, 70%, 50%)`,
      backgroundColor: `hsla(${idx * 120}, 70%, 50%, 0.2)`,
      tension: 0.1
    }));
  
    return (
      <div className="chart-container">
        <Line
          data={{
            labels: data.comparison[topics[0]].time_series.news.dates,
            datasets: datasets
          }}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'News Mentions Comparison',
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
  
  const YouTubeComparisonChart = ({ data, topics }) => {
    if (!data || !topics) return null;
  
    const datasets = topics.map((topic, idx) => ({
      label: topic,
      data: data.comparison[topic].time_series.youtube.counts,
      borderColor: `hsl(${idx * 120}, 70%, 50%)`,
      backgroundColor: `hsla(${idx * 120}, 70%, 50%, 0.2)`,
      tension: 0.1
    }));
  
    return (
      <div className="chart-container">
        <Line
          data={{
            labels: data.comparison[topics[0]].time_series.youtube.dates,
            datasets: datasets
          }}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'YouTube Mentions Comparison',
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
  
  const ComparisonSummaryCards = ({ data, topics }) => {
    if (!data || !topics) return null;
  
    return (
      <div className="comparison-cards">
        {topics.map((topic, idx) => (
          <div key={idx} className="comparison-card">
            <h3>{topic}</h3>
            <div className="comparison-stats">
              <div className="stat">
                <div className="stat-value">{data.comparison[topic].stats.total_mentions}</div>
                <div className="stat-label">Total Mentions</div>
              </div>
              <div className="stat">
                <div className="stat-value">{data.comparison[topic].stats.news_mentions}</div>
                <div className="stat-label">News Articles</div>
              </div>
              <div className="stat">
                <div className="stat-value">{data.comparison[topic].stats.youtube_mentions}</div>
                <div className="stat-label">YouTube Videos</div>
              </div>
              <div className="stat">
                <div className="stat-value">{data.comparison[topic].stats.avg_engagement.toFixed(2)}</div>
                <div className="stat-label">Avg Engagement</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const ComparisonTrendsTable = ({ data, topics }) => {
    if (!data || !topics) return null;
  
    return (
      <div className="comparison-trends">
        <h3>Top Trends Comparison</h3>
        <div className="trends-grid">
          {topics.map(topic => (
            <div key={topic} className="trend-column">
              <h4>{topic}</h4>
              <table>
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Score</th>
                    <th>Freq</th>
                  </tr>
                </thead>
                <tbody>
                  {data.comparison[topic].trends.combined.map((trend, idx) => (
                    <tr key={idx}>
                      <td>{trend.term}</td>
                      <td>{trend.combined_score?.toFixed(2) || trend.score?.toFixed(2)}</td>
                      <td>{trend.frequency || trend.news_data?.frequency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const SentimentComparison = ({ data, topics }) => {
    if (!data || !topics) return null;
  
    const sentimentData = {
      labels: ['Positive', 'Negative', 'Neutral'],
      datasets: topics.map((topic, idx) => ({
        label: topic,
        data: [
          data.comparison[topic].sentiment.positive || 0,
          data.comparison[topic].sentiment.negative || 0,
          data.comparison[topic].sentiment.neutral || 0
        ],
        backgroundColor: `hsla(${idx * 120}, 70%, 50%, 0.4)`,
        borderColor: `hsl(${idx * 120}, 70%, 50%)`,
        borderWidth: 1
      }))
    };
  
    return (
      <div className="chart-container">
        <Bar
          data={sentimentData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Sentiment Comparison',
                font: { size: 16 }
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Count'
                }
              }
            }
          }}
        />
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
      <div className="modern-bar-chart-container">
  <Bar
    data={{
      labels: topTerms.map(t => t.term),
      datasets: [{
        label: 'Relevance Score',
        data: topTerms.map(t => t.combined_score),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 0,
        borderRadius: 4,
        borderSkipped: false,
        barThickness: 28,
        hoverBackgroundColor: 'rgba(99, 102, 241, 1)'
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
          color: '#1e293b',
          font: {
            size: 18,
            weight: '600',
            family: "'Inter', sans-serif"
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#f8fafc',
          bodyColor: '#e2e8f0',
          titleFont: {
            size: 14,
            weight: '500'
          },
          bodyFont: {
            size: 13
          },
          padding: 12,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `Score: ${context.raw.toFixed(2)}`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            color: '#e2e8f0'
          },
          ticks: {
            color: '#64748b',
            font: {
              family: "'Inter', sans-serif"
            }
          },
          title: { 
            display: true, 
            text: 'Relevance Score',
            color: '#475569',
            font: {
              size: 14,
              weight: '500',
              family: "'Inter', sans-serif"
            },
            padding: { top: 10 }
          }
        },
        y: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: '#1e293b',
            font: {
              family: "'Inter', sans-serif",
              size: 13
            },
            mirror: true,
            padding: -20,
            z: 1
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
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
                borderColor: '#1e88e5',
        backgroundColor: 'rgba(30, 136, 229, 0.1)',
        tension: 0.3,
        fill: true
              },
              {
                label: 'YouTube Mentions',
                data: data.analysis.time_series.youtube.counts,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.3,
        fill: true
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
                'rgba(0, 71, 255, 0.7)',
                'rgba(0, 178, 255, 0.7)',
                'rgba(76, 175, 80, 0.7)'
              ],
              borderColor: [
                'rgba(0, 71, 255, 1)',
                'rgba(0, 178, 255, 1)',
                'rgba(76, 175, 80, 1)'
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
            <span className="stat-value">{data.stats.trend_stats.combined.avg_score}</span>
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
                <span className="stat-value">{data.stats.trend_stats.news_only.avg_score}</span>
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
                <span className="stat-value">{data.stats.trend_stats.youtube_only.avg_score}</span>
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
        <h1>
          <span className="highlight-container">
            <span className="highlight-bg"></span>
            <span className="highlight-text">الرياضية</span>
          </span>
          تحليل الترندات 
        </h1>
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
              className="modern-input"
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
                className="modern-input"
              />
            </div>
          </div>
        )}

        <div className="control-group">
          <label>Time Period:</label>
          <select 
            value={days} 
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="modern-select"
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
          {loading ? (
            <>
              <span className="spinner"></span>
              Analyzing...
            </>
          ) : 'Analyze'}
        </button>
      </form>

      {loading && (
  <div className="loading-container">
    <h3 className="loading-header">جاري تحليل البيانات</h3>
    <div className="loading-bar">
      <div className="loading-progress"></div>
    </div>
  
    
    <p className="loading-note">انتظر قليلاً، قد تأخذ العملية بضع دقائق...</p>
  </div>
)}

      {error && !loading && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {!compareMode && data && !loading && !error && (
        <div className="dashboard">
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
    <h2>Comparing: {comparisonData.topics.join(' vs ')}</h2>
    <p className="time-period">{comparisonData.time_period}</p>
    
    <ComparisonSummaryCards data={comparisonData} topics={comparisonData.topics} />
    
    <div className="section">
      <h3>Activity Over Time</h3>
      <ComparisonTimeSeries data={comparisonData} topics={comparisonData.topics} />
      <YouTubeComparisonChart data={comparisonData} topics={comparisonData.topics} />
    </div>
    
    <div className="section">
      <h3>Sentiment Analysis</h3>
      <SentimentComparison data={comparisonData} topics={comparisonData.topics} />
    </div>
    
    <div className="section">
      <ComparisonTrendsTable data={comparisonData} topics={comparisonData.topics} />
    </div>
  </div>
)}
    </div>
  );
};

export default TrendDashboard;