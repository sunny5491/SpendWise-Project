import React from 'react';
import AuthService from '../services/AuthService';
import { Navigate } from 'react-router-dom';

interface LoginState {
  email: string;
  password: string;
  error: string;
  redirectToDashboard: boolean;
}

class Login extends React.Component<{}, LoginState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      redirectToDashboard: false
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [e.target.name]: e.target.value
    } as Pick<LoginState, keyof LoginState>);
  }

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AuthService.login(this.state.email, this.state.password);
      this.setState({ redirectToDashboard: true });
    } catch (err: any) {
      this.setState({ error: err.response?.data?.error || 'Login failed' });
    }
  }

  render() {
    if (this.state.redirectToDashboard) {
      return <Navigate to="/dashboard" />;
    }

    return (
      <div className="auth-container">
        <div className="glass-card" style={{ width: '400px' }}>
          <h2 className="title" style={{ textAlign: 'center' }}>Welcome Back</h2>
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
            <button type="submit" className="btn" style={{ width: '100%' }}>Login</button>
          </form>
          <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Don't have an account? <a href="/register" style={{ color: 'var(--primary-color)' }}>Register</a>
          </p>
        </div>
      </div>
    );
  }
}

export default Login;
