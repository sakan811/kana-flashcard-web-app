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
          <p className="homeDescription">
              This is a demo website.<br/>
              For the full-featured experience, please use the Docker version.<br/>
              Click <a href="https://github.com/sakan811/kana-flashcard-web-app" target="_blank"
                       rel="noopener noreferrer">here</a> for instructions on GitHub.
          </p>
          <div>
              <button className="homeButton" onClick={() => goToRandomKana('hiragana')}>Practice Hiragana</button>
              <button className="homeButton" onClick={() => goToRandomKana('katakana')}>Practice Katakana</button>
          </div>
      </div>
  );
};

export default Home;