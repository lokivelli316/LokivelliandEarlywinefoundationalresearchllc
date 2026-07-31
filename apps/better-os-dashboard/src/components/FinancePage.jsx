import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import { v4 as uuidv4 } from 'uuid'

const FinancePage = () => {
  const { financialData, updateFinancialData } = useStore()
  const [transactions, setTransactions] = useState(financialData.transactions || [])
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [showForm, setShowForm] = useState(false)

  const transactionTypes = [
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
    { value: 'investment', label: 'Investment' },
    { value: 'transfer', label: 'Transfer' }
  ]

  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.category) return
    
    const amount = parseFloat(newTransaction.amount)
    if (isNaN(amount)) return
    
    const transaction = {
      id: uuidv4(),
      ...newTransaction,
      amount
    }
    
    const newTransactions = [...transactions, transaction]
    setTransactions(newTransactions)
    
    // Update balance based on transaction type
    let balanceChange = 0
    if (transaction.type === 'income') balanceChange = amount
    if (transaction.type === 'expense') balanceChange = -amount
    if (transaction.type === 'investment') balanceChange = -amount // Investment reduces cash
    
    updateFinancialData({
      transactions: newTransactions,
      balance: financialData.balance + balanceChange
    })
    
    setNewTransaction({
      type: 'expense',
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    })
    setShowForm(false)
  }

  const deleteTransaction = (id) => {
    const transaction = transactions.find(t => t.id === id)
    if (!transaction) return
    
    const newTransactions = transactions.filter(t => t.id !== id)
    setTransactions(newTransactions)
    
    // Recalculate balance
    let balanceChange = 0
    if (transaction.type === 'income') balanceChange = -transaction.amount
    if (transaction.type === 'expense') balanceChange = transaction.amount
    if (transaction.type === 'investment') balanceChange = transaction.amount
    
    updateFinancialData({
      transactions: newTransactions,
      balance: financialData.balance + balanceChange
    })
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'income': return 'var(--success)'
      case 'expense': return 'var(--error)'
      case 'investment': return 'var(--info)'
      case 'transfer': return 'var(--warning)'
      default: return 'var(--steel)'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'income': return '💰'
      case 'expense': return '💸'
      case 'investment': return '📈'
      case 'transfer': return '🔄'
      default: return '💳'
    }
  }

  const calculateStats = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const investments = transactions
      .filter(t => t.type === 'investment')
      .reduce((sum, t) => sum + t.amount, 0)
    
    return { income, expenses, investments, net: income - expenses }
  }

  const stats = calculateStats()

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          <span>💰</span>
          Financial Hub
        </h1>
        <p className="page-subtitle">
          Manage transactions and investments
        </p>
      </div>

      <div className="page-content">
        {/* Stats */}
        <div className="grid grid-4" style={{ gap: '20px' }}>
          <div className="card stat-card">
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💰</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--paper)' }}>
              ${financialData.balance.toLocaleString()}
            </div>
            <div style={{ color: 'var(--steel-dim)', fontSize: '0.85rem' }}>Total Balance</div>
          </div>
          <div className="card stat-card">
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💵</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--success)' }}>
              ${stats.income.toLocaleString()}
            </div>
            <div style={{ color: 'var(--steel-dim)', fontSize: '0.85rem' }}>Total Income</div>
          </div>
          <div className="card stat-card">
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💸</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--error)' }}>
              ${stats.expenses.toLocaleString()}
            </div>
            <div style={{ color: 'var(--steel-dim)', fontSize: '0.85rem' }}>Total Expenses</div>
          </div>
          <div className="card stat-card">
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📈</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--info)' }}>
              ${stats.investments.toLocaleString()}
            </div>
            <div style={{ color: 'var(--steel-dim)', fontSize: '0.85rem' }}>Investments</div>
          </div>
        </div>

        {/* Add Transaction */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Add Transaction</h3>
            <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm">
              {showForm ? 'Cancel' : '+ Add Transaction'}
            </button>
          </div>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="grid grid-2" style={{ gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                    className="form-select"
                  >
                    {transactionTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                    placeholder="Enter category"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    placeholder="Enter amount"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  placeholder="Enter description (optional)"
                  className="form-textarea"
                  rows={2}
                />
              </div>
              <button onClick={addTransaction} className="btn btn-primary">
                Add Transaction
              </button>
            </motion.div>
          )}
        </div>

        {/* Transaction List */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Transaction History</h3>
          </div>
          {transactions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'var(--vault-light)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: `4px solid ${getTypeColor(transaction.type)}`
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{getTypeIcon(transaction.type)}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, color: 'var(--paper)' }}>
                      {transaction.category}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--steel-dim)' }}>
                      {transaction.description}
                    </div>
                  </div>
                  <div style={{ color: getTypeColor(transaction.type), fontWeight: 500 }}>
                    {transaction.type === 'expense' || transaction.type === 'investment' ? '-' : '+'}
                    ${transaction.amount.toLocaleString()}
                  </div>
                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    className="btn btn-secondary btn-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span style={{ fontSize: '3rem' }}>💳</span>
              <h3>No transactions yet</h3>
              <p>Add your first transaction to get started</p>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📚 About Financial Hub</h3>
          </div>
          <p style={{ color: 'var(--steel)' }}>
            This is a prototype financial management interface. In a full implementation, this would include:
          </p>
          <ul style={{ color: 'var(--steel-dim)', marginTop: '12px', paddingLeft: '20px' }}>
            <li>Bank account integration</li>
            <li>Investment portfolio tracking</li>
            <li>Budgeting tools</li>
            <li>Financial reports and charts</li>
            <li>Tax calculations</li>
          </ul>
          <p style={{ color: 'var(--steel)', marginTop: '12px' }}>
            <strong>Note:</strong> This is a demonstration only. Do not use for real financial data.
          </p>
        </div>
      </div>
    </div>
  )
}

export default FinancePage
