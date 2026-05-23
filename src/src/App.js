import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './pages/Dashboard';
import PlaidLink from './components/PlaidLink';
import Navigation from './components/Navigation';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [accountsRes, transactionsRes] = await Promise.all([
        axios.get('/api/accounts'),
        axios.get('/api/transactions'),
      ]);
      setAccounts(accountsRes.data);
      setTransactions(transactionsRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaidSuccess = () => {
    fetchData();
  };

  return (
    <div className="app">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="app-content">
        {error && <div className="error-banner">{error}</div>}

        {currentPage === 'dashboard' && (
          <Dashboard
            accounts={accounts}
            transactions={transactions}
            loading={loading}
          />
        )}

        {currentPage === 'connect' && (
          <PlaidLink onSuccess={handlePlaidSuccess} />
        )}
      </main>
    </div>
  );
}

export default App;
