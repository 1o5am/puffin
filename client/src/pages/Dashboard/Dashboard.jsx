import './Dashboard.scss';
import { useState } from 'react';
import { Insights } from '../../components/Insights/Insights';
import financialData from '../../assets/financialData.json';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const Dashboard = () => {
  const [metrics] = useState(financialData.dashboard.metrics);
  const savingsRate = ((metrics.monthlyIncome - metrics.monthlyExpenses) / metrics.monthlyIncome) * 100;
  const targetSavingsRate = 40;

  // Insights
  const insightsData = {
    metrics,
    savingsRate,
    targetSavingsRate,
    transactions: financialData.transactions,
    goals: financialData.goals,
    budgets: financialData.budgets
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">TOTAL BALANCE</div>
          <div className="metric-value">{formatCurrency(metrics.totalBalance)}</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">MONTHLY INCOME</div>
          <div className="metric-value income">{formatCurrency(metrics.monthlyIncome)}</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">MONTHLY EXPENSES</div>
          <div className="metric-value expenses">{formatCurrency(metrics.monthlyExpenses)}</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">GOAL PROGRESS</div>
          <div className="metric-value">{savingsRate.toFixed(1)}%</div>
          <div className="progress-info">Target: {targetSavingsRate}% savings rate</div>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${(savingsRate / targetSavingsRate) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <Insights page="dashboard" data={insightsData} />
    </div>
  );
};

export default Dashboard;