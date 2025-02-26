import { useState } from 'react';
import { Insights } from '../../components/Insights/Insights';
import GoalModal from '../../components/GoalModal/GoalModal';
import financialData from '../../assets/financialData.json';
import './Goals.scss';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const Goals = () => {
  const [goals, setGoals] = useState(financialData.goals);
  const [transactions] = useState(financialData.transactions);
  const [showModal, setShowModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Goal Progress
  const goalsWithProgress = goals.map(goal => {
    const saved = goal.current;
    const progress = (saved / goal.target) * 100;
    
    const targetDate = new Date(goal.deadline);
    const remainingDays = Math.ceil((targetDate - new Date()) / (1000 * 60 * 60 * 24));
    
    return {
      ...goal,
      saved,
      progress,
      remainingDays
    };
  });

  // Handle saving goal (both add and edit)
  const handleSaveGoal = (goalData) => {
    if (goalData.id) {
      // Edit existing goal
      setGoals(prev => prev.map(g => g.id === goalData.id ? goalData : g));
    } else {
      const newGoal = {
        ...goalData,
        id: goals.length + 1,
        current: 0
      };
      setGoals(prev => [...prev, newGoal]);
    }
    setShowModal(false);
    setSelectedGoal(null);
  };

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setShowModal(true);
  };

  const insightsData = {
    goals: goalsWithProgress,
    transactions: transactions.filter(t => t.amount > 0),
    totalSaved: goalsWithProgress.reduce((sum, g) => sum + g.current, 0),
    totalTarget: goalsWithProgress.reduce((sum, g) => sum + g.target, 0)
  };

  return (
    <div className="goals">
      <div className="goals-header">
        <h1>Financial Goals</h1>
        <button 
          className="add-goal" 
          onClick={() => {
            setSelectedGoal(null);
            setShowModal(true);
          }}
        >
          Add Goal
        </button>
      </div>

      <Insights page="goals" data={insightsData} />

      <div className="goals-grid">
        {goalsWithProgress.map(goal => (
          <div key={goal.id} className="goal-card" onClick={() => handleEditGoal(goal)}>
            <div className="goal-header">
              <h3>{goal.name}</h3>
              <span className="goal-type">{goal.type}</span>
            </div>
            
            <div className="goal-progress">
              <div className="progress-info">
                <span>{formatCurrency(goal.current)} saved</span>
                <span>of {formatCurrency(goal.target)}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${Math.min(goal.progress, 100)}%` }}
                />
              </div>
              <span className="progress-percentage">{goal.progress.toFixed(1)}%</span>
            </div>

            <div className="goal-footer">
              <div className="timeline">
                <i className="far fa-calendar"></i>
                <span>
                  {goal.remainingDays > 0 
                    ? `${goal.remainingDays} days remaining` 
                    : 'Goal deadline passed'}
                </span>
              </div>
              <div className="monthly-target">
                <span>Monthly target: </span>
                <span>{formatCurrency((goal.target - goal.current) / Math.max(Math.ceil(goal.remainingDays / 30), 1))}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <GoalModal
          goal={selectedGoal}
          onSave={handleSaveGoal}
          onClose={() => {
            setShowModal(false);
            setSelectedGoal(null);
          }}
        />
      )}
    </div>
  );
};

export default Goals;