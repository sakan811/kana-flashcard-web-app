import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RandomKana from './components/showKana';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:kanaType" element={<RandomKana />} />
      </Routes>
    </Router>
  );
};

export default App;
