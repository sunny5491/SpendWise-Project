import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthService from './services/AuthService';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

interface PrivateRouteProps {
  children: React.ReactNode;
}

class PrivateRoute extends React.Component<PrivateRouteProps> {
  render() {
    return AuthService.isAuthenticated() ? (
      <>{this.props.children}</>
    ) : (
      <Navigate to="/login" />
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="app-wrapper">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
