import React from 'react';
import '../Styles/firstChart.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'ميسي', mentions: 320 },
  { name: 'رونالدو', mentions: 290 },
  { name: 'هالاند', mentions: 230 },
  { name: 'محمد صلاح', mentions: 180 },
  { name: 'مبابي', mentions: 160 },
];

const FirstChart = () => {
  return (
    <div className="top-chart-container">
      <h3 className="chart-title">أكثر اللاعبين ذكراً هذا الأسبوع</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid className="chart-grid" />
          <XAxis dataKey="name" className="axis" />
          <YAxis className="axis" />
          <Tooltip wrapperClassName="custom-tooltip" />
          <Bar dataKey="mentions" className="bar" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FirstChart;
