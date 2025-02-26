import { useState, useEffect } from 'react';
import './GoalModal.scss';

const GoalModal = ({ goal, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    deadline: new Date().toISOString().split('T')[0],
    type: 'savings',
    priority: 'medium',
    current: 0
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        target: goal.target.toString(),
        deadline: goal.deadline,
        type: goal.type,
        priority: goal.priority,
        current: goal.current || 0
      });
    }
  }, [goal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.target || isNaN(formData.target) || parseFloat(formData.target) <= 0) {
      newErrors.target = 'Enter a valid target amount greater than 0';
    }
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const updatedGoal = {
      ...goal,
      ...formData,
      target: parseFloat(formData.target),
      id: goal?.id
    };
    onSave(updatedGoal);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{goal ? 'Edit Goal' : 'Add New Goal'}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Goal Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., New Car"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="target">Target Amount</label>
            <input
              type="number"
              id="target"
              name="target"
              value={formData.target}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={errors.target ? 'error' : ''}
            />
            {errors.target && <span className="error-message">{errors.target}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Target Date</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className={errors.deadline ? 'error' : ''}
            />
            {errors.deadline && <span className="error-message">{errors.deadline}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="type">Goal Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="savings">Savings</option>
              <option value="investment">Investment</option>
              <option value="debt">Debt Repayment</option>
              <option value="purchase">Major Purchase</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-button">Save Goal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;