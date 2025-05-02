import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import '../Styles/about.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrendsSection = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/hero_trends?days=30&limit=8');
        const data = await response.json();
        
        if (!response.ok || data.error) {
          throw new Error(data.error || 'Failed to fetch trends');
        }
        
        setTrends(data.trends || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  // Prepare chart data using actual terms as labels
  const lineChartData = {
    labels: trends.map(trend => trend.term),
    datasets: [
      {
        label: 'عدد الظهور',
        data: trends.map(trend => trend.count),
        borderColor: '#1e88e5',
        backgroundColor: 'rgba(30, 136, 229, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#1e88e5',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        rtl: true,
        labels: {
          font: {
            size: 14,
            family: 'Tahoma, Arial, sans-serif'
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'توزيع الظهور للمصطلحات',
        font: {
          size: 18,
          weight: 'bold',
          family: 'Tahoma, Arial, sans-serif'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        rtl: true,
        bodyFont: {
          size: 14,
          family: 'Tahoma, Arial, sans-serif'
        },
        titleFont: {
          size: 16,
          family: 'Tahoma, Arial, sans-serif'
        },
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `${context.raw} ظهور`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
            family: 'Tahoma, Arial, sans-serif'
          },
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          font: {
            size: 12,
            family: 'Tahoma, Arial, sans-serif'
          },
          padding: 10
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        beginAtZero: true
      }
    }
  };

  if (loading) return (
    <div className="trends-loading-container">
      <div className="trends-loading-spinner"></div>
      <p>جاري تحميل أحدث البيانات...</p>
    </div>
  );

  if (error) return (
    <div className="trends-error-container">
      <div className="trends-error-icon">!</div>
      <p>حدث خطأ أثناء تحميل البيانات: {error}</p>
    </div>
  );

  return (
    <section className="home-trends-section">
      <div className="trends-header">
        <h2>أهم المصطلحات الرياضية الشائعة</h2>
        <p className="trends-subtitle">الأكثر تداولاً خلال الأسبوع الماضي</p>
      </div>

      <div className="trends-visualization">
        <div className="trends-chart-container">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>

        <div className="trends-list-container">
          {trends.map((trend, index) => (
            <div key={index} className="trend-card">
              <div className="trend-rank-badge">{index + 1}</div>
              <div className="trend-info">
                <h3 className="trend-term">{trend.term}</h3>
                <div className="trend-meta">
                  <span className="trend-count">{trend.count} ظهور</span>
                  <div className="trend-bar">
                    <div 
                      className="trend-progress" 
                      style={{ width: `${(trend.count / trends[0].count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendsSection;