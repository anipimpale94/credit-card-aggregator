import React, { useState } from 'react';
import { format } from 'date-fns';
import '../styles/TransactionList.css';

function TransactionList({ transactions, accounts = [] }) {
  const [sortBy, setSortBy] = useState('date-desc');

  const accountMap = accounts.reduce((map, acc) => {
    map[acc.id] = acc;
    return map;
  }, {});

  const sorted = [...transactions].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  return (
    <div className="transaction-list-container">
      <div className="transaction-header">
        <h2>Transactions</h2>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      <div className="transaction-list">
        {sorted.length === 0 ? (
          <p className="no-transactions">No transactions found</p>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Account</th>
                <th>Category</th>
                <th className="amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((transaction) => {
                const account = accountMap[transaction.account_id];
                return (
                  <tr key={transaction.id}>
                    <td>{format(new Date(transaction.date), 'MMM dd, yyyy')}</td>
                    <td>{transaction.name}</td>
                    <td>{account ? `${account.name} (${account.mask})` : 'Unknown'}</td>
                    <td>{transaction.category || 'Other'}</td>
                    <td className="amount negative">{transaction.amount.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TransactionList;
