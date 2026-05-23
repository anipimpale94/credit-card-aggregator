import React, { useState, useMemo } from 'react';
import TransactionList from '../components/TransactionList';
import BudgetTracker from '../components/BudgetTracker';
import SpendingChart from '../components/SpendingChart';
import '../styles/Dashboard.css';

function Dashboard({ accounts, transactions, loading }) {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // week, month, year

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (selectedAccount) {
      filtered = filtered.filter(t => t.account_id === selectedAccount);
    }

    return filtered;
  }, [transactions, selectedAccount]);

  const totalSpent = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const spendingByCategory = useMemo(() => {
    const categories = {};
    filteredTransactions.forEach(t => {
      const cat = t.category || 'Other';
      categories[cat] = (categories[cat] || 0) + t.amount;
    });
    return categories;
  }, [filteredTransactions]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>

        <div className="filters">
          <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
            <option value="">All Accounts</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name} - {acc.mask}
              </option>
            ))}
          </select>

          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Spent</h3>
          <p className="stat-value">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Transactions</h3>
          <p className="stat-value">{filteredTransactions.length}</p>
        </div>
        <div className="stat-card">
          <h3>Average</h3>
          <p className="stat-value">
            ${filteredTransactions.length > 0 ? (totalSpent / filteredTransactions.length).toFixed(2) : '0.00'}
          </p>
        </div>
        <div className="stat-card">
          <h3>Accounts</h3>
          <p className="stat-value">{accounts.length}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="left-section">
          <SpendingChart data={spendingByCategory} />
          <BudgetTracker spendingByCategory={spendingByCategory} />
        </div>

        <div className="right-section">
          <TransactionList transactions={filteredTransactions} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
