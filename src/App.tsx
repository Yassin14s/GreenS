import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import PageGreen from './pages/PageGreen';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import PrivateAdminRoute from './components/PrivateAdminRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="pt-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/verify/:signatureId" element={<PageGreen />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route
                  path="/admin-dashboard"
                  element={
                    <PrivateAdminRoute>
                      <AdminDashboard />
                    </PrivateAdminRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;