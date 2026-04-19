import React from 'react';
import { type ExpenseData } from '../services/ExpenseService';

interface ExpenseListProps {
  expenses: ExpenseData[];
  onDelete: (id: number) => void;
}

class ExpenseList extends React.Component<ExpenseListProps> {
  render() {
    const { expenses, onDelete } = this.props;

    return (
      <div className="glass-card" style={{ height: '100%' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Recent Transactions</h3>
        
        {expenses.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>No expenses logged yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {expenses.map(expense => (
              <div 
                key={expense.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px'
                }}
              >
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{expense.category}</h4>
                  <small style={{ color: 'var(--text-secondary)' }}>
                    {new Date(expense.created_at).toLocaleDateString()}
                  </small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <strong style={{ fontSize: '1.1rem' }}>${expense.amount.toFixed(2)}</strong>
                  <button 
                    onClick={() => onDelete(expense.id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--danger-color)', 
                      cursor: 'pointer',
                      fontSize: '1.2rem'
                    }}
                    title="Delete"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default ExpenseList;
