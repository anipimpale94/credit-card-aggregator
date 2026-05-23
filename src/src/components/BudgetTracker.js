import React, { useState } from 'react';
import '../styles/BudgetTracker.css';

function BudgetTracker({ spendingByCategory }) {
  const [budgets, setBudgets] = useState({});

  const handleBudgetChange = (category, value) => {
    setBudgets({
      ...budgets,
      [category]: parseFloat(value) || 0,
    });
  };

  const categories = Object.keys(spendingByCategory);

  return (
    <div className="budget-tracker-container">
      <h2>Budget Tracker</h2>

      {categories.length === 0 ? (
        <p className="no-data">No spending categories yet</p>
      ) : (
        <div className="budget-list">
          {categories.map((category) => {
            const spent = spendingByCategory[category];
            const budget = budgets[category] || 0;
            const percentage = budget > 0 ? (spent / budget) * 100 : 0;
            const isOverBudget = spent > budget && budget > 0;

            return (
              <div key={category} className="budget-item">
                <div className="budget-label">
                  <span className="category-name">{category}</span>
                  <span className="amount-spent">${spent.toFixed(2)}</span>
                </div>

                <input
                  type="number"
                  placeholder="Set budget"
                  value={budgets[category] || ''}
                  onChange={(e) => handleBudgetChange(category, e.target.value)}
                  className="budget-input"
                />

                {budget > 0 && (
                  <>
                    <div className={`progress-bar ${isOverBudget ? 'over-budget' : ''}`}>
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <p className={`budget-status ${isOverBudget ? 'over' : 'under'}`}>
                      {isOverBudget
                        ? `Over by $${(spent - budget).toFixed(2)}`
                        : `$${(budget - spent).toFixed(2)} remaining`}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BudgetTracker;
