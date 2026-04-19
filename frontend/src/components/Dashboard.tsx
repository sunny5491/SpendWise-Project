import React from 'react';
import ExpenseService, { ExpenseData } from '../services/ExpenseService';
import BudgetService, { BudgetStatus } from '../services/BudgetService';
import AuthService from '../services/AuthService';
import { Navigate } from 'react-router-dom';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';

interface DashboardState {
  expenses: ExpenseData[];
  budgetStatus: BudgetStatus | null;
  budgetInput: string;
  loggedOut: boolean;
}

class Dashboard extends React.Component<{}, DashboardState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      expenses: [],
      budgetStatus: null,
      budgetInput: '',
      loggedOut: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const expenses = await ExpenseService.getExpenses();
      
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      let budgetStatus = null;
      try {
        budgetStatus = await BudgetService.getBudgetStatus(currentMonth);
      } catch (e) {
         // budget might not exist for the month 
      }
      
      this.setState({ expenses, budgetStatus });
    } catch (e) {
      console.error(e);
    }
  }

  handleExpenseAdded = () => {
    this.fetchData();
  }

  handleExpenseDeleted = async (id: number) => {
    await ExpenseService.deleteExpense(id);
    this.fetchData();
  }

  handleSetBudget = async () => {
    if (!this.state.budgetInput) return;
    const currentMonth = new Date().toISOString().slice(0, 7);
    await BudgetService.setBudget(parseFloat(this.state.budgetInput), currentMonth);
    this.setState({ budgetInput: '' });
    this.fetchData();
  }

  handleLogout = () => {
    AuthService.logout();
    this.setState({ loggedOut: true });
  }

  render() {
    if (this.state.loggedOut) {
      return <Navigate to="/login" />;
    }

    const { budgetStatus } = this.state;
    const currentMonthLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="title" style={{ margin: 0 }}>SpendWise Dashboard</h1>
          <button className="btn btn-danger" onClick={this.handleLogout}>Logout</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          <div className="left-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-card">
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Budget Insights</h3>
              {budgetStatus ? (
                <div>
                  <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>${budgetStatus.remaining.toFixed(2)}</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>Remaining out of ${budgetStatus.limit} limit</p>
                  <p>Total Spent: <strong style={{ color: 'var(--danger-color)' }}>${budgetStatus.spent.toFixed(2)}</strong></p>
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)' }}>No budget set for {currentMonthLabel}.</p>
              )}
              
              <div style={{ marginTop: '1.5rem' }}>
                <input 
                  type="number" 
                  placeholder="Set limit" 
                  className="input-field" 
                  value={this.state.budgetInput}
                  onChange={(e) => this.setState({ budgetInput: e.target.value })}
                  style={{ marginBottom: '10px' }}
                />
                <button className="btn" onClick={this.handleSetBudget} style={{ width: '100%' }}>Save Budget</button>
              </div>
            </div>

            <ExpenseForm onExpenseAdded={this.handleExpenseAdded} />
          </div>

          <div className="right-panel">
            <ExpenseList expenses={this.state.expenses} onDelete={this.handleExpenseDeleted} />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
