import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PlaidLink.css';

function PlaidLink({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleConnect = async () => {
    try {
      setLoading(true);
      setMessage('');

      // Get Plaid link token
      const response = await axios.post('/api/plaid/create-link-token');
      const { link_token } = response.data;

      if (window.Plaid) {
        window.Plaid.create({
          token: link_token,
          onSuccess: async (public_token) => {
            // Exchange public token for access token
            await axios.post('/api/plaid/exchange-token', { public_token });
            setMessage('Bank account connected successfully!');
            setTimeout(() => onSuccess(), 1500);
          },
          onExit: (err) => {
            setMessage('Connection cancelled');
          },
        }).open();
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('Failed to connect bank account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plaid-container">
      <div className="plaid-card">
        <h2>Connect Your Bank Account</h2>
        <p>Link your bank account to automatically import transactions</p>

        <button
          className="connect-btn"
          onClick={handleConnect}
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect Bank Account'}
        </button>

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}

export default PlaidLink;
