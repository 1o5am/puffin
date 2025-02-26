// src/components/Insights.jsx
import { useState, useEffect } from 'react';
import { generateInsights } from '../../utils/openai';
import './Insights.scss';

export const Insights = ({ page, data }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await generateInsights(page, data);
        if (result.error) {
          setError(result.error);
          return;
        }
        setInsights(result);
      } catch (error) {
        console.error('Error fetching insights:', error);
        setError('Failed to generate insights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (data) {
      fetchInsights();
    }
  }, [page, data]);

  if (loading) {
    return (
      <div className="insights-section">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Generating AI insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="insights-section">
        <div className="error-message">
          <p>{error}</p>
          {error.includes('rate limit') && (
            <p>Please wait a moment before trying again.</p>
          )}
        </div>
      </div>
    );
  }

  if (!insights) return null;

  const renderDashboardInsights = () => {
    if (!insights.spendingPatterns || !insights.budgetStatus || !insights.goalsProgress) {
      return <div className="error-message">Invalid dashboard insights data</div>;
    }

    return (
      <>
        <div className="insight-card spending-patterns">
          <h3>Spending Patterns</h3>
          <p>{insights.spendingPatterns.mtd}</p>
          <p>{insights.spendingPatterns.trends}</p>
        </div>
        <div className="insight-card budget-status">
          <h3>Budget Status</h3>
          <p className={insights.budgetStatus.overall?.toLowerCase()}>{insights.budgetStatus.overall}</p>
          <p>{insights.budgetStatus.details}</p>
        </div>
        <div className="insight-card goals-progress">
          <h3>Goals Progress</h3>
          {insights.goalsProgress.byGoal?.map((goal, index) => (
            <div key={index} className={`goal-item ${goal.status?.toLowerCase()}`}>
              <h4>{goal.name}</h4>
              <p>{goal.detail}</p>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderTransactionInsights = () => {
    if (!insights.daily || !insights.categories || !insights.recommendations) {
      return <div className="error-message">Invalid transaction insights data</div>;
    }

    return (
      <>
        <div className="insight-card daily">
          <h3>Recent Activity</h3>
          <div className="daily-insights">
            <p>Yesterday: {insights.daily.yesterday || 'No data'}</p>
            <p>This Week: {insights.daily.weekToDate || 'No data'}</p>
            <p>This Month: {insights.daily.monthToDate || 'No data'}</p>
          </div>
        </div>
        <div className="insight-card categories">
          <h3>Category Analysis</h3>
          <p>{insights.categories.topSpending}</p>
          <p>{insights.categories.unusual}</p>
          <p>{insights.categories.improving}</p>
        </div>
        <div className="insight-card recommendations">
          <h3>Recommendations</h3>
          <ul>
            {(insights.recommendations || []).map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  const renderGoalsInsights = () => {
    if (!insights.achievement || !insights.redFlags || !insights.strengths || !insights.recommendations) {
      return <div className="error-message">Invalid goals insights data</div>;
    }

    return (
      <>
        <div className="insight-card achievement">
          <h3>Achievement Status</h3>
          <p>{insights.achievement.overall}</p>
          <p>{insights.achievement.timeframe}</p>
        </div>
        <div className="insight-card alerts">
          <h3>Red Flags</h3>
          <ul>
            {(insights.redFlags || []).map((flag, index) => (
              <li key={index} className="alert">{flag}</li>
            ))}
          </ul>
        </div>
        <div className="insight-card strengths">
          <h3>What's Working Well</h3>
          <ul>
            {(insights.strengths || []).map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
        <div className="insight-card recommendations">
          <h3>Recommendations</h3>
          <ul>
            {(insights.recommendations || []).map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  const renderBudgetInsights = () => {
    if (!insights.monthlyPacing || !insights.alerts || !insights.recommendations) {
      return <div className="error-message">Invalid budget insights data</div>;
    }

    return (
      <>
        <div className="insight-card monthly-pacing">
          <h3>Monthly Pacing</h3>
          <p className={insights.monthlyPacing.overall?.toLowerCase()}>
            {insights.monthlyPacing.overall}
          </p>
          <div className="category-status">
            {(insights.monthlyPacing.byCategory || []).map((cat, index) => (
              <div key={index} className="category-item">
                <span>{cat.category}</span>
                <span>{cat.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="insight-card alerts">
          <h3>Important Alerts</h3>
          <ul>
            {(insights.alerts || []).map((alert, index) => (
              <li key={index} className="alert">{alert}</li>
            ))}
          </ul>
        </div>
        <div className="insight-card recommendations">
          <h3>Recommendations</h3>
          <ul>
            {(insights.recommendations || []).map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  return (
    <div className="insights-section">
      <h2>AI-Powered Insights</h2>
      <div className="insights-grid">
        {page === 'dashboard' && renderDashboardInsights()}
        {page === 'transactions' && renderTransactionInsights()}
        {page === 'goals' && renderGoalsInsights()}
        {page === 'budgets' && renderBudgetInsights()}
      </div>
    </div>
  );
};