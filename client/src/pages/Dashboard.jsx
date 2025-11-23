import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Moon, Sun, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import DashboardCharts from '../components/DashboardCharts';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/Spinner';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/analytics/summary');
        setSummary(res.data);
      } catch (error) {
        console.error('Failed to fetch summary', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Welcome back, {user?.username}!
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Here's your financial overview.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={toggleTheme}
              className="btn"
              style={{ padding: '0.5rem', borderRadius: '9999px' }}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user?.role === 'admin' && (
              <Link to="/admin" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                Admin Panel
              </Link>
            )}
            <button onClick={logout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="grid" style={{ marginBottom: '2rem', gap: '1.5rem' }}>
        <div className="card card-hover" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '9999px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              <DollarSign size={24} />
            </div>
            <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Total Balance</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>${summary.balance.toFixed(2)}</h2>
        </div>
        <div className="card card-hover" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '9999px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <TrendingUp size={24} />
            </div>
            <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Income</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>+${summary.income.toFixed(2)}</h2>
        </div>
        <div className="card card-hover" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '9999px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <TrendingDown size={24} />
            </div>
            <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Expenses</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger)' }}>-${summary.expense.toFixed(2)}</h2>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <DashboardCharts />
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to="/transactions" className="btn btn-primary" style={{ display: 'inline-block', padding: '0.75rem 1.5rem' }}>
          View All Transactions
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
