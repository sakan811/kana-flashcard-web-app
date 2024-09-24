import {useNavigate} from "react-router-dom";
import React from "react";
import './css/home.css'

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1 className="homeTitle">
          Japanese Kana Flashcard App
      </h1>
      <div>
        <button className="homeButton" onClick={() => navigate('/hiragana')}>Practice Hiragana</button>
        <button className="homeButton" onClick={() => navigate('/katakana')}>Practice Katakana</button>
      </div>
    </div>
  );
};

export default Home;