import React from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import FleetPage from './pages/FleetPage'
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import Dashboard from './components/Dashboard';
import { ToggleProvider } from "./Context/ToggleContext";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CoveragePage from './pages/CoveragePage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <ToggleProvider>
        <BrowserRouter>
          <div className='relative'>
            <div className='sticky top-0 z-10'>
              <Header />
            </div>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/coverage" element={<CoveragePage />} />
              <Route path="/fleet" element={<FleetPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
               <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </div>
        </BrowserRouter>  
      </ToggleProvider>
    </AuthProvider>
  );
}

export default App;