import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import RandomKana from "./components/showKana";
import Navigation from "./components/Navigation";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:kanaType" element={<RandomKana />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
