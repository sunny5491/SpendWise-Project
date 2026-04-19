import React from 'react';
import AuthService from '../services/AuthService';
import { Navigate } from 'react-router-dom';

interface RegisterState {
  email: string;
  password: "";
  error: string;
  redirectToLogin: boolean;
}

class Register extends React.Component<{}, RegisterState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      redirectToLogin: false
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [e.target.name]: e.target.value
    } as Pick<RegisterState, keyof RegisterState>);
  }

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AuthService.register(this.state.email, this.state.password);
      this.setState({ redirectToLogin: true });
    } catch (err: any) {
      this.setState({ error: err.response?.data?.error || 'Registration failed' });
    }
  }

  render() {
    if (this.state.redirectToLogin) {
      return <Navigate to="/login" />;
    }

    return (
      <div className="auth-container">
        <div className="glass-card" style={{ width: '400px' }}>
          <h2 className="title" style={{ textAlign: 'center' }}>Create Account</h2>
          {this.state.error && <p style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{this.state.error}</p>}
          <form onSubmit={this.handleSubmit}>
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              className="input-field" 
              value={this.state.email} 
              onChange={this.handleInputChange} 
              required 
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              className="input-field" 
              value={this.state.password} 
              onChange={this.handleInputChange} 
              required 
            />
            <button type="submit" className="btn" style={{ width: '100%' }}>Register</button>
          </form>
          <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Already have an account? <a href="/login" style={{ color: 'var(--primary-color)' }}>Login</a>
          </p>
        </div>
      </div>
    );
  }
}

export default Register;
