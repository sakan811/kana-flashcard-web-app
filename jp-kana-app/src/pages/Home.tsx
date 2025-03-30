import {useNavigate} from "react-router-dom";
import React from "react";

const Home = () => {
  const navigate = useNavigate();

  const goToRandomKana = (kanaType: 'hiragana' | 'katakana') => {
    navigate(`/${kanaType}`);
  };

  return (
    <div className="flex flex-col justify-center items-center text-center min-h-screen p-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
        Japanese Kana Flashcard App
      </h1>
      <p className="mb-8 text-gray-600 max-w-md">
        Learn Japanese kana characters with interactive flashcards. Practice Hiragana and Katakana to improve your Japanese reading skills.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors duration-200 shadow-md w-full sm:w-auto"
          onClick={() => goToRandomKana('hiragana')}
        >
          Practice Hiragana
        </button>
        <button 
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors duration-200 shadow-md w-full sm:w-auto"
          onClick={() => goToRandomKana('katakana')}
        >
          Practice Katakana
        </button>
      </div>
    </div>
  );
};

export default Home;