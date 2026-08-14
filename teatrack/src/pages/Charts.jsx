import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Charts.css';
import './Page.css';

const TEA_COLOR = '#B8793E';
const COFFEE_COLOR = '#6F4930';
const EXPENSE_COLOR = '#063A26';

export default function Charts({ entries }) {
  const [activeChart, setActiveChart] = useState('bar');

  const barData = entries.map(e => ({
    date: e.date.split(' ')[0] + ' ' + e.date.split(' ')[1],
    Tea: e.tea,
    Coffee: e.coffee,
    Total: e.totalCups,
  }));

  const lineData = entries.map(e => ({
    date: e.date.split(' ')[0] + ' ' + e.date.split(' ')[1],
    Expense: e.amount,
  }));

  const totalTea = entries.reduce((s, e) => s + e.tea, 0);
  const totalCoffee = entries.reduce((s, e) => s + e.coffee, 0);
  const pieData = [
    { name: 'Tea', value: totalTea },
    { name: 'Coffee', value: totalCoffee },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }}>
              {p.name}: <strong>{p.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="charts-page">
      <div className="page-header">
        <div>
          <h2>📈 Charts</h2>
          <p className="text-muted">Visual trends of your tea & coffee consumption</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="chart-tabs">
        {['bar', 'line', 'pie'].map(tab => (
          <button
            key={tab}
            className={`chart-tab-btn ${activeChart === tab ? 'active' : ''}`}
            onClick={() => setActiveChart(tab)}
          >
            {tab === 'bar' && '📊 Bar Chart'}
            {tab === 'line' && '📉 Expense Trend'}
            {tab === 'pie' && '🥧 Distribution'}
          </button>
        ))}
      </div>

      {/* Bar Chart */}
      {activeChart === 'bar' && (
        <div className="card chart-card">
          <h3 className="chart-heading">Daily Tea vs Coffee Consumption</h3>
          <p className="text-muted chart-sub">Cups consumed per day</p>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={barData} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Tea" fill={TEA_COLOR} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Coffee" fill={COFFEE_COLOR} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Line Chart */}
      {activeChart === 'line' && (
        <div className="card chart-card">
          <h3 className="chart-heading">Daily Expense Trend</h3>
          <p className="text-muted chart-sub">Total spend per day (₹)</p>
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={lineData} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={v => `₹${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="Expense"
                stroke={EXPENSE_COLOR}
                strokeWidth={2.5}
                dot={{ fill: EXPENSE_COLOR, r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Pie Chart */}
      {activeChart === 'pie' && (
        <div className="card chart-card">
          <h3 className="chart-heading">Tea vs Coffee Distribution</h3>
          <p className="text-muted chart-sub">Total cups breakdown</p>
          <div className="pie-wrapper">
            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={140}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill={TEA_COLOR} />
                  <Cell fill={COFFEE_COLOR} />
                </Pie>
                <Tooltip formatter={(v) => [`${v} cups`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="chart-stats-row">
        <div className="chart-stat-card">
          <span className="chart-stat-icon">🍵</span>
          <div>
            <p className="chart-stat-label">Total Tea Cups</p>
            <p className="chart-stat-value">{totalTea}</p>
          </div>
        </div>
        <div className="chart-stat-card">
          <span className="chart-stat-icon">☕</span>
          <div>
            <p className="chart-stat-label">Total Coffee Cups</p>
            <p className="chart-stat-value">{totalCoffee}</p>
          </div>
        </div>
        <div className="chart-stat-card">
          <span className="chart-stat-icon">📅</span>
          <div>
            <p className="chart-stat-label">Days Tracked</p>
            <p className="chart-stat-value">{entries.length}</p>
          </div>
        </div>
        <div className="chart-stat-card">
          <span className="chart-stat-icon">📊</span>
          <div>
            <p className="chart-stat-label">Avg Cups/Day</p>
            <p className="chart-stat-value">
              {entries.length > 0 ? Math.round((totalTea + totalCoffee) / entries.length) : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
