import { useState, useEffect } from 'react';
// import { CloseIcon } from './Icons';
import './TransactionModal.scss';

const TransactionModal = ({ transaction, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense',
    paymentMethod: 'Credit Card',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: Math.abs(transaction.amount).toString(),
        category: transaction.category,
        type: transaction.type,
        paymentMethod: transaction.paymentMethod,
        notes: transaction.notes || ''
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Enter a valid amount greater than 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const amount = parseFloat(formData.amount);
    const finalAmount = formData.type === 'expense' ? -amount : amount;
    
    const updatedTransaction = {
      ...transaction,
      ...formData,
      amount: finalAmount,
      id: transaction?.id
    };
    
    onSave(updatedTransaction);
  };

  return (
    <div className="modal-overlay">
      <div className="transaction-modal">
        <div className="modal-header">
          <h2>{transaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="transaction-type-selector">
              <div className={`type-option ${formData.type === 'expense' ? 'active' : ''}`}>
                <input
                  type="radio"
                  id="expense"
                  name="type"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={handleChange}
                />
                <label htmlFor="expense">Expense</label>
              </div>
              
              <div className={`type-option ${formData.type === 'income' ? 'active' : ''}`}>
                <input
                  type="radio"
                  id="income"
                  name="type"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={handleChange}
                />
                <label htmlFor="income">Income</label>
              </div>
              
              <div className={`type-option ${formData.type === 'transfer' ? 'active' : ''}`}>
                <input
                  type="radio"
                  id="transfer"
                  name="type"
                  value="transfer"
                  checked={formData.type === 'transfer'}
                  onChange={handleChange}
                />
                <label htmlFor="transfer">Transfer</label>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What was this transaction for?"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <div className="amount-input">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={errors.amount ? 'error' : ''}
                />
              </div>
              {errors.amount && <span className="error-message">{errors.amount}</span>}
            </div>
          </div>
          
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select a category</option>
                {formData.type === 'income' ? (
                  <option value="Income">Income</option>
                ) : formData.type === 'transfer' ? (
                  <option value="Transfer">Transfer</option>
                ) : (
                  categories
                    .filter(cat => cat !== 'Income' && cat !== 'Transfer' && cat !== 'all')
                    .map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))
                )}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Mobile Payment">Mobile Payment</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="notes">Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional details..."
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="button button--outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="button button--primary"
            >
              {transaction ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;