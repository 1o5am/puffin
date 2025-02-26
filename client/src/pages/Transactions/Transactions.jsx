import { useState, useEffect } from 'react';
import { Insights } from '../../components/Insights/Insights';
import financialData from '../../assets/financialData.json';
import './Transactions.scss';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const ITEMS_PER_PAGE = 10;

const Transactions = () => {
  const [allTransactions, setAllTransactions] = useState(financialData.transactions);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    amount: '',
    type: 'expense'
  });

  // Initial sort of transactions by date
  useEffect(() => {
    setFilteredTransactions([...allTransactions].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    }));
  }, [allTransactions]);

  // Handle search input
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search button click
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Filter and search transactions
  useEffect(() => {
    let result = [...allTransactions].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    if (searchQuery.trim()) {
      result = result.filter(transaction => 
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilter !== 'All') {
      result = result.filter(transaction => {
        if (activeFilter === 'Income') return transaction.amount > 0;
        if (activeFilter === 'Expenses') return transaction.amount < 0;
        return true;
      });
    }

    setFilteredTransactions(result);
    setCurrentPage(1);
  }, [searchQuery, activeFilter, allTransactions]);

  const insightsData = {
    transactions: allTransactions,
    recentTransactions: allTransactions.slice(0, 30), // Last 30 transactions
    categories: [...new Set(allTransactions.map(t => t.category))],
    dateRange: {
      start: allTransactions[allTransactions.length - 1]?.date,
      end: allTransactions[0]?.date
    }
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const amount = parseFloat(newTransaction.amount);
    if (isNaN(amount)) return;

    const transaction = {
      id: allTransactions.length + 1,
      date: newTransaction.date,
      description: newTransaction.description,
      category: newTransaction.category,
      amount: newTransaction.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      status: 'completed'
    };

    setAllTransactions(prev => [...prev, transaction]);
    setShowAddModal(false);
    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: '',
      amount: '',
      type: 'expense'
    });
  };

  // Show transactions on multiple pages
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="transactions">
      <div className="transactions-header">
        <h1>Transactions</h1>
        <button className="add-transaction" onClick={() => setShowAddModal(true)}>
          Add Transaction
        </button>
      </div>

      <Insights page="transactions" data={insightsData} />

      <div className="transactions-filters">
        <div className="search-bar">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={handleSearchInput}
            />
            <button type="submit">Search</button>
          </form>
        </div>

        <div className="filter-buttons">
          <button
            className={activeFilter === 'All' ? 'active' : ''}
            onClick={() => setActiveFilter('All')}
          >
            All
          </button>
          <button
            className={activeFilter === 'Income' ? 'active' : ''}
            onClick={() => setActiveFilter('Income')}
          >
            Income
          </button>
          <button
            className={activeFilter === 'Expenses' ? 'active' : ''}
            onClick={() => setActiveFilter('Expenses')}
          >
            Expenses
          </button>
        </div>
      </div>

      <div className="transactions-list">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
                <td className={transaction.amount < 0 ? 'negative' : 'positive'}>
                  {formatCurrency(transaction.amount)}
                </td>
                <td>{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={startIndex + ITEMS_PER_PAGE >= filteredTransactions.length}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Transaction</h2>
            <form onSubmit={handleAddTransaction}>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={e => setNewTransaction({...newTransaction, date: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={e => setNewTransaction({...newTransaction, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={newTransaction.category}
                  onChange={e => setNewTransaction({...newTransaction, category: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={newTransaction.type}
                  onChange={e => setNewTransaction({...newTransaction, type: e.target.value})}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit">Add</button>
                <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;