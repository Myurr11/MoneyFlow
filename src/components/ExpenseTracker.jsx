  import React, { useState, useEffect } from 'react';
  import { Plus, Trash2, Edit2, DollarSign, TrendingUp, Calendar, PieChart } from 'lucide-react';

  const ExpenseTracker = () => {
    const [expenses, setExpenses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      note: '',
      category: 'food'
    });
    const [filter, setFilter] = useState({ category: 'all', month: 'all' });
    const [error, setError] = useState('');

    const categories = [
      { value: 'food', label: '🍔 Food', color: 'orange' },
      { value: 'travel', label: '✈️ Travel', color: 'blue' },
      { value: 'bills', label: '💡 Bills', color: 'red' },
      { value: 'entertainment', label: '🎮 Entertainment', color: 'purple' },
      { value: 'shopping', label: '🛍️ Shopping', color: 'pink' },
      { value: 'health', label: '⚕️ Health', color: 'green' },
      { value: 'other', label: '📌 Other', color: 'gray' }
    ];

    useEffect(() => {
      const sampleExpenses = [
        { id: 1, amount: 450.00, date: '2025-10-05', note: 'Grocery shopping at D-Mart', category: 'food' },
        { id: 2, amount: 1200.00, date: '2025-10-04', note: 'Monthly internet bill', category: 'bills' },
        { id: 3, amount: 350.00, date: '2025-10-03', note: 'Movie tickets', category: 'entertainment' },
        { id: 4, amount: 2500.00, date: '2025-09-28', note: 'Flight booking to Goa', category: 'travel' },
        { id: 5, amount: 899.00, date: '2025-09-25', note: 'New headphones', category: 'shopping' }
      ];
      setExpenses(sampleExpenses);
    }, []);

    const validateForm = () => {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        setError('Please enter a valid amount greater than 0');
        return false;
      }
      if (!formData.date) {
        setError('Please select a date');
        return false;
      }
      if (!formData.note.trim()) {
        setError('Please add a note/description');
        return false;
      }
      setError('');
      return true;
    };

    const handleSubmit = () => {
      if (!validateForm()) return;

      const expense = {
        id: editingId || Date.now(),
        amount: parseFloat(formData.amount),
        date: formData.date,
        note: formData.note.trim(),
        category: formData.category
      };

      if (editingId) {
        setExpenses(expenses.map(exp => exp.id === editingId ? expense : exp));
        setEditingId(null);
      } else {
        setExpenses([...expenses, expense]);
      }

      setFormData({ amount: '', date: new Date().toISOString().split('T')[0], note: '', category: 'food' });
      setShowForm(false);
      setError('');
    };

    const handleEdit = (expense) => {
      setFormData({
        amount: expense.amount.toString(),
        date: expense.date,
        note: expense.note,
        category: expense.category
      });
      setEditingId(expense.id);
      setShowForm(true);
      setError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
      if (window.confirm('Are you sure you want to delete this expense?')) {
        setExpenses(expenses.filter(exp => exp.id !== id));
      }
    };

    const handleCancel = () => {
      setShowForm(false);
      setEditingId(null);
      setFormData({ amount: '', date: new Date().toISOString().split('T')[0], note: '', category: 'food' });
      setError('');
    };

    const getFilteredExpenses = () => {
      return expenses.filter(exp => {
        const categoryMatch = filter.category === 'all' || exp.category === filter.category;
        const monthMatch = filter.month === 'all' || exp.date.substring(0, 7) === filter.month;
        return categoryMatch && monthMatch;
      });
    };

    const getSummary = () => {
      const filtered = getFilteredExpenses();
      const total = filtered.reduce((sum, exp) => sum + exp.amount, 0);
      
      const byCategory = filtered.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {});

      const byMonth = filtered.reduce((acc, exp) => {
        const month = exp.date.substring(0, 7);
        acc[month] = (acc[month] || 0) + exp.amount;
        return acc;
      }, {});

      const avgPerTransaction = filtered.length > 0 ? total / filtered.length : 0;
      
      const sortedCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
      const topCategory = sortedCategories[0] || ['none', 0];

      return { total, byCategory, byMonth, count: filtered.length, avgPerTransaction, topCategory };
    };

    const summary = getSummary();
    const filteredExpenses = getFilteredExpenses().sort((a, b) => new Date(b.date) - new Date(a.date));

    const getMonthOptions = () => {
      const months = [...new Set(expenses.map(exp => exp.date.substring(0, 7)))];
      return months.sort().reverse();
    };

    const getCategoryBadge = (color) => {
      const colors = {
        orange: 'bg-orange-50 text-orange-700 border-orange-200',
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        red: 'bg-red-50 text-red-700 border-red-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
        pink: 'bg-pink-50 text-pink-700 border-pink-200',
        green: 'bg-green-50 text-green-700 border-green-200',
        gray: 'bg-gray-50 text-gray-700 border-gray-200'
      };
      return colors[color] || colors.gray;
    };

    const getCategoryBar = (color) => {
      const colors = {
        orange: 'bg-orange-400',
        blue: 'bg-blue-400',
        red: 'bg-red-400',
        purple: 'bg-purple-400',
        pink: 'bg-pink-400',
        green: 'bg-green-400',
        gray: 'bg-gray-400'
      };
      return colors[color] || colors.gray;
    };

    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">MoneyFlow</h1>
                <p className="text-gray-600 text-sm mt-1">Personal Expense Tracker</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
              >
                <Plus size={18} />
                {showForm ? 'Cancel' : 'Add Expense'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-900">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={18} className="text-gray-700" />
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total Spent</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">₹{summary.total.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">{summary.count} transactions</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={18} className="text-gray-700" />
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Average</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">₹{summary.avgPerTransaction.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">per transaction</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-2">
                  <PieChart size={18} className="text-gray-700" />
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Top Category</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {categories.find(c => c.value === summary.topCategory[0])?.label.split(' ')[1] || 'None'}
                </p>
                <p className="text-xs text-gray-500 mt-1">₹{summary.topCategory[1].toFixed(2)}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={18} className="text-gray-700" />
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Active Months</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(summary.byMonth).length}</p>
                <p className="text-xs text-gray-500 mt-1">tracking period</p>
              </div>
            </div>
          </div>

          {showForm && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingId ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Note/Description</label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    rows="3"
                    placeholder="What was this expense for?"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2.5 px-4 rounded-lg transition-colors font-medium"
                  >
                    {editingId ? 'Update Expense' : 'Add Expense'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filter.category}
                  onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <select
                  value={filter.month}
                  onChange={(e) => setFilter({ ...filter, month: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="all">All Months</option>
                  {getMonthOptions().map(month => (
                    <option key={month} value={month}>
                      {new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {Object.keys(summary.byCategory).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Category Breakdown</h2>
              <div className="space-y-4">
                {Object.entries(summary.byCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => {
                  const category = categories.find(c => c.value === cat);
                  const percentage = (amount / summary.total) * 100;
                  return (
                    <div key={cat}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getCategoryBadge(category.color)}`}>
                          {category.label}
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900">₹{amount.toFixed(2)}</span>
                          <span className="text-xs text-gray-500 ml-2">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getCategoryBar(category.color)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
              <span className="text-sm text-gray-500 font-medium">{filteredExpenses.length} expenses</span>
            </div>
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500 font-medium">No expenses found</p>
                <p className="text-gray-400 text-sm mt-1">Add your first expense to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredExpenses.map(expense => {
                  const category = categories.find(c => c.value === expense.category);
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getCategoryBadge(category.color)}`}>
                            {category.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(expense.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-900 font-medium truncate">{expense.note}</p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className="text-xl font-bold text-gray-900">₹{expense.amount.toFixed(2)}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default ExpenseTracker;