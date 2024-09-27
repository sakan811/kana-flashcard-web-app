import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import RandomKana from "../src/components/showKana";

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
