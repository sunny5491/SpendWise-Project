import React from 'react';
import ExpenseService from '../services/ExpenseService';

interface ExpenseFormProps {
  onExpenseAdded: () => void;
}

interface ExpenseFormState {
  amount: string;
  category: string;
  error: string;
}

class ExpenseForm extends React.Component<ExpenseFormProps, ExpenseFormState> {
  constructor(props: ExpenseFormProps) {
    super(props);
    this.state = {
      amount: '',
      category: '',
      error: ''
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    this.setState({
      [e.target.name]: e.target.value
    } as Pick<ExpenseFormState, keyof ExpenseFormState>);
  }

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ExpenseService.addExpense(parseFloat(this.state.amount), this.state.category);
      this.setState({ amount: '', category: '', error: '' });
      this.props.onExpenseAdded();
    } catch (err: any) {
      this.setState({ error: 'Failed to add expense' });
    }
  }

  render() {
    return (
      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Log New Expense</h3>
        {this.state.error && <p style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{this.state.error}</p>}
        <form onSubmit={this.handleSubmit}>
          <input 
            type="number" 
            name="amount" 
            placeholder="Amount ($)" 
            className="input-field" 
            value={this.state.amount} 
            onChange={this.handleInputChange} 
            required 
            min="0.01" step="0.01"
          />
          <select 
            name="category" 
            className="input-field" 
            value={this.state.category} 
            onChange={this.handleInputChange} 
            required
            style={{ backgroundColor: 'transparent' }}
          >
            <option value="" disabled style={{ color: '#000' }}>Select Category</option>
            <option value="Food" style={{ color: '#000' }}>Food</option>
            <option value="Transport" style={{ color: '#000' }}>Transport</option>
            <option value="Rent" style={{ color: '#000' }}>Rent</option>
            <option value="Entertainment" style={{ color: '#000' }}>Entertainment</option>
            <option value="Other" style={{ color: '#000' }}>Other</option>
          </select>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }}>Log Expense</button>
        </form>
      </div>
    );
  }
}

export default ExpenseForm;
