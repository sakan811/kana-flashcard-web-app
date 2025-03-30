import {useNavigate} from "react-router-dom";
import React from "react";
import './home.css'

const Home = () => {
  const navigate = useNavigate();

  const goToRandomKana = (kanaType: 'hiragana' | 'katakana') => {
    navigate(`/${kanaType}`);
  };

  return (
    <div className="home">
      <h1 className="homeTitle">
          Japanese Kana Flashcard App
      </h1>
      <div>
        <button className="homeButton" onClick={() => goToRandomKana('hiragana')}>Practice Hiragana</button>
        <button className="homeButton" onClick={() => goToRandomKana('katakana')}>Practice Katakana</button>
      </div>
    </div>
  );
};

export default Home;