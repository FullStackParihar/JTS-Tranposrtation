import React from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import FleetPage from './pages/FleetPage'
import ServicesPage from './pages/ServicesPage';
import { ToggleProvider } from "./Context/ToggleContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CoveragePage from './pages/CoveragePage';

function App() {
  return (
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
          </Routes>
        </div>
      </BrowserRouter>
    </ToggleProvider>
  );
}

export default App;
