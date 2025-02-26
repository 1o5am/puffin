import { useState } from 'react';
import { Insights } from '../../components/Insights/Insights';
import financialData from '../../assets/financialData.json';
import './Budget.scss';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const Budget = () => {
  const [budgets] = useState(financialData.budgets);
  const [transactions] = useState(financialData.transactions);

  // Calculate total budget and spending
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.budgeted, 0);
  const totalSpent = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Calculate spending by category
  const spendingByCategory = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  // Prepare data for insights
  const insightsData = {
    budgets,
    totalBudget,
    totalSpent,
    spendingByCategory,
    transactions: transactions.filter(t => t.amount < 0), // Only expenses
    remainingDays: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()
  };

  return (
    <div className="budget">
      <div className="budget-header">
        <h1>Budget</h1>
        <div className="budget-summary">
          <div className="summary-card">
            <h3>Total Budget</h3>
            <p>{formatCurrency(totalBudget)}</p>
          </div>
          <div className="summary-card">
            <h3>Total Spent</h3>
            <p>{formatCurrency(totalSpent)}</p>
          </div>
          <div className="summary-card">
            <h3>Remaining</h3>
            <p>{formatCurrency(totalBudget - totalSpent)}</p>
          </div>
        </div>
      </div>

      <Insights page="budgets" data={insightsData} />

      <div className="budget-categories">
        <h2>Budget Categories</h2>
        <div className="categories-grid">
          {budgets.map(budget => {
            const spent = spendingByCategory[budget.category] || 0;
            const percentage = (spent / budget.budgeted) * 100;
            
            return (
              <div key={budget.id} className="category-card">
                <div className="category-header">
                  <h3>{budget.category}</h3>
                  <span className={percentage > 100 ? 'over-budget' : ''}>
                    {formatCurrency(spent)} / {formatCurrency(budget.budgeted)}
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ 
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: percentage > 100 ? 'var(--color-error)' : 'var(--color-primary)'
                    }}
                  />
                </div>
                <div className="category-footer">
                  <span>{percentage.toFixed(1)}% used</span>
                  <span>{formatCurrency(budget.budgeted - spent)} remaining</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Budget;