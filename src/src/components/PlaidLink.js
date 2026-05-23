import React, { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import '../styles/PlaidLink.css';

function PlaidLink({ onSuccess }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkToken, setLinkToken] = useState(null);

  const handlePlaidSuccess = async (public_token, metadata) => {
    try {
      setLoading(true);
      setMessage('Processing...');
      await axios.post('/api/plaid/exchange-token', { public_token });
      setMessage('Bank account connected successfully!');
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      console.error('Error exchanging token:', err);
      setMessage('Failed to connect account: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: handlePlaidSuccess,
    onExit: (err) => {
      if (err) {
        console.error('Plaid error:', err);
        setMessage('Connection failed: ' + err.message);
      } else {
        setMessage('Connection cancelled');
      }
    },
  });

  // Open the Plaid link when token becomes available
  useEffect(() => {
    if (linkToken && ready && open) {
      open();
      setLoading(false);
    }
  }, [linkToken, ready, open]);

  const handleConnect = async () => {
    try {
      setLoading(true);
      setMessage('');
      const response = await axios.post('/api/plaid/create-link-token');
      setLinkToken(response.data.link_token);
    } catch (err) {
      console.error('Error:', err);
      setMessage('Failed to connect bank account: ' + err.message);
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
