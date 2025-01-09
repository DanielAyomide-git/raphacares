import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import Analytics from './components/Analytics';
import ServiceProviders from './components/ServiceProviders';
import Patients from './components/Patients';
import AdminProfile from './components/AdminProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Sidebar />}>
          <Route path="analytics" element={<Analytics />} />
          <Route path="service-providers" element={<ServiceProviders />} />
          <Route path="patients" element={<Patients />} />
          <Route path="admin-profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
