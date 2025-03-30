import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import RandomKana from "./components/showKana";
import Navigation from "./components/Navigation";

const App: React.FC = () => {
  return (
    <Router>
      <Navigation />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:kanaType" element={<RandomKana />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
