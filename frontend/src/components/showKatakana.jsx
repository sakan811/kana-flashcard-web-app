import React, {useState, useEffect, useCallback} from 'react';
import './showKana.css';
import {getRandomCharacter} from "./funcs/utilsFunc";
import KanaPerformanceTable from "./kanaPerformanceTable";
import {useNavigate} from "react-router-dom";
import {updateKanaWeight, getKanaPerformance, submitAnswer} from "./funcs/showKanaFunc";

// Initialize with equal weights
const initialKatakanaCharacters  = [
  { katakana: "ア", romanji: "a", weight: 1 },
  { katakana: "イ", romanji: "i", weight: 1 },
  { katakana: "ウ", romanji: "u", weight: 1 },
  { katakana: "エ", romanji: "e", weight: 1 },
  { katakana: "オ", romanji: "o", weight: 1 },
  { katakana: "カ", romanji: "ka", weight: 1 },
  { katakana: "キ", romanji: "ki", weight: 1 },
  { katakana: "ク", romanji: "ku", weight: 1 },
  { katakana: "ケ", romanji: "ke", weight: 1 },
  { katakana: "コ", romanji: "ko", weight: 1 },
  { katakana: "サ", romanji: "sa", weight: 1 },
  { katakana: "シ", romanji: "shi", weight: 1 },
  { katakana: "ス", romanji: "su", weight: 1 },
  { katakana: "セ", romanji: "se", weight: 1 },
  { katakana: "ソ", romanji: "so", weight: 1 },
  { katakana: "タ", romanji: "ta", weight: 1 },
  { katakana: "チ", romanji: "chi", weight: 1 },
  { katakana: "ツ", romanji: "tsu", weight: 1 },
  { katakana: "テ", romanji: "te", weight: 1 },
  { katakana: "ト", romanji: "to", weight: 1 },
  { katakana: "ナ", romanji: "na", weight: 1 },
  { katakana: "ニ", romanji: "ni", weight: 1 },
  { katakana: "ヌ", romanji: "nu", weight: 1 },
  { katakana: "ネ", romanji: "ne", weight: 1 },
  { katakana: "ノ", romanji: "no", weight: 1 },
  { katakana: "ハ", romanji: "ha", weight: 1 },
  { katakana: "ヒ", romanji: "hi", weight: 1 },
  { katakana: "フ", romanji: "fu", weight: 1 },
  { katakana: "ヘ", romanji: "he", weight: 1 },
  { katakana: "ホ", romanji: "ho", weight: 1 },
  { katakana: "マ", romanji: "ma", weight: 1 },
  { katakana: "ミ", romanji: "mi", weight: 1 },
  { katakana: "ム", romanji: "mu", weight: 1 },
  { katakana: "メ", romanji: "me", weight: 1 },
  { katakana: "モ", romanji: "mo", weight: 1 },
  { katakana: "ヤ", romanji: "ya", weight: 1 },
  { katakana: "ユ", romanji: "yu", weight: 1 },
  { katakana: "ヨ", romanji: "yo", weight: 1 },
  { katakana: "ラ", romanji: "ra", weight: 1 },
  { katakana: "リ", romanji: "ri", weight: 1 },
  { katakana: "ル", romanji: "ru", weight: 1 },
  { katakana: "レ", romanji: "re", weight: 1 },
  { katakana: "ロ", romanji: "ro", weight: 1 },
  { katakana: "ワ", romanji: "wa", weight: 1 },
  { katakana: "ヲ", romanji: "wo", weight: 1 },
  { katakana: "ン", romanji: "n", weight: 1 },
];


const tableColumns = [
  { key: 'katakana', header: 'Katakana' },
  { key: 'romanji', header: 'Romanji' },
  { key: 'correct_answer', header: 'Correct Answers' },
  { key: 'total_answer', header: 'Total Answers' },
  { key: 'accuracy', header: 'Accuracy (%)' },
];

const tableTitle = 'Katakana Performance'
const kanaType = 'katakana'

const RandomKatakana = () => {
  const navigate = useNavigate();
  const [currentKatakana, setCurrentKatakana] = useState(initialKatakanaCharacters[0]);
  const [inputValue, setInputValue] = useState('');
  const [correctMsg, setCorrectMsg] = useState('');
  const [incorrectMsg, setIncorrectMsg] = useState('');
  const [performanceData, setPerformanceData] = useState([]);

  const getRandomKatakana = useCallback((katakanaData) => {
    return getRandomCharacter(katakanaData);
  }, []);

  const fetchAndUpdateKatakana = useCallback(async () => {
    const updatedCharWeight = await updateKanaWeight(initialKatakanaCharacters, kanaType)
    setCurrentKatakana(getRandomKatakana(updatedCharWeight));
  }, [getRandomKatakana]);

  const getKatakanaPerformance = useCallback(async () => {
    await getKanaPerformance(setPerformanceData, kanaType)
  }, [setPerformanceData]);

  useEffect(() => {
    fetchAndUpdateKatakana();
    getKatakanaPerformance();
  }, [fetchAndUpdateKatakana, getKatakanaPerformance]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isCorrect = inputValue.toLowerCase() === currentKatakana.romanji;

    try {
      await submitAnswer(kanaType, inputValue, currentKatakana, isCorrect)

      if (isCorrect) {
        setCorrectMsg('Correct!');
        setIncorrectMsg('');
      } else {
        setIncorrectMsg(`Incorrect. It is <b>${currentKatakana.romanji}</b>`);
        setCorrectMsg('');
      }

      // Parallelized
      await Promise.all([
        getKatakanaPerformance(),
        fetchAndUpdateKatakana()
      ]);

      // Reset input immediately
      setInputValue('');

      // Reset inputs and messages with delay
      setTimeout(() => {
        setCorrectMsg('');
        setIncorrectMsg('');
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
      setIncorrectMsg('Submission failed. Please try again.');
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <div className="titleContainer">
        <h1 className="title">Katakana Flashcard</h1>
        <button className="backButton" onClick={() => navigate('/')}>Back</button>
      </div>
      <div className="kanaBox">
        <div className="kanaCard">
          <h1 className="kanaCharacter">{currentKatakana.katakana || 'Loading...'}</h1>
        </div>
      </div>
      <form id="romanjiForm" onSubmit={handleSubmit}>
        <label htmlFor="romanjiInput" className="inputTitle">Enter Romanji:</label>
        <input
          type="text"
          id="romanjiInput"
          name="romanjiInput"
          placeholder="Type here..."
          value={inputValue}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
      {correctMsg && <p className="correctMsg">{correctMsg}</p>}
      {incorrectMsg && <p className="incorrectMsg" dangerouslySetInnerHTML={{ __html: incorrectMsg }}></p>}
      <KanaPerformanceTable performanceData={performanceData} columns={tableColumns} title={tableTitle} />
    </>
  );
};

export default RandomKatakana;
