import React, { useState, useEffect } from 'react';
import '../Styles/sidebar.css'
const Sidebar = ({ isOpen }) => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('light-mode', isLight);
  }, [isLight]);

  const toggleTheme = () => {
    setIsLight(prev => !prev);
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul>
        <li><a href="/">😡 نسبة الآراء السلبية/الإيجابية اليوم</a></li>
        <li><a href="/explorer">🔥 اللاعب الأكثر تداولًا هذا الأسبوع</a></li>
        <li><a href="/trends">📊 الفريق الأكثر تفاعلًا</a></li>
        <li><a href="/settings">🏆 أبرز المنافسات الحالية</a></li>
        <li><a href="/help">❓ مساعدة</a></li>
        <li><a href="/help">⚙️ إعدادات</a></li>
        <li>
          <button onClick={toggleTheme} className="theme-toggle-btn">
            <span className="toggle-icon">{isLight ? '☀️' : '🌙'}</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
