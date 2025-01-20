import React from 'react';
import Header from './components/Header'; 
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className='relative'>
    <div className='sticky top-0 z-10'><Header /></div>
       
      <HomePage />
    </div>
  );
}

export default App;
