import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RandomKatakana from "./components/showKatakana";
import RandomHiragana from "./components/showHiragana";
import Home from "./components/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/katakana" element={<RandomKatakana />} />
        <Route path="/hiragana" element={<RandomHiragana />} />
      </Routes>
    </Router>
  );
};

export default App;
