import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import ElectionResults from './components/ElectionResults';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import VotingInterface from './components/VotingInterface';
import VotingHub from './components/VotingHub';
import AdminLogin from './components/AdminLogin';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/results" element={<ElectionResults />} />
      <Route path="/register" element={<div>Register Page</div>} /> {/* Placeholder for register page */}
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/vote" element={<VotingInterface />} />
      <Route path="/voting-hub" element={<VotingHub />} />
    </Routes>
  );
};

export default AppRoutes;
