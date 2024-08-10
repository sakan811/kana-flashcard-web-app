import React, {useState, useEffect, useCallback} from 'react';
import './showKana.css';
import {getRandomCharacter} from "./funcs/utilsFunc";
import KanaPerformanceTable from "./kanaPerformanceTable";
import {updateKanaWeight, getKanaPerformance, submitAnswer} from "./funcs/showKanaFunc";
import {useNavigate} from "react-router-dom";

// Initialize with equal weights
const initialHiraganaCharacters = [
  { hiragana: "あ", romanji: "a", weight: 1 },
  { hiragana: "い", romanji: "i", weight: 1 },
  { hiragana: "う", romanji: "u", weight: 1 },
  { hiragana: "え", romanji: "e", weight: 1 },
  { hiragana: "お", romanji: "o", weight: 1 },
  { hiragana: "か", romanji: "ka", weight: 1 },
  { hiragana: "き", romanji: "ki", weight: 1 },
  { hiragana: "く", romanji: "ku", weight: 1 },
  { hiragana: "け", romanji: "ke", weight: 1 },
  { hiragana: "こ", romanji: "ko", weight: 1 },
  { hiragana: "さ", romanji: "sa", weight: 1 },
  { hiragana: "し", romanji: "shi", weight: 1 },
  { hiragana: "す", romanji: "su", weight: 1 },
  { hiragana: "せ", romanji: "se", weight: 1 },
  { hiragana: "そ", romanji: "so", weight: 1 },
  { hiragana: "た", romanji: "ta", weight: 1 },
  { hiragana: "ち", romanji: "chi", weight: 1 },
  { hiragana: "つ", romanji: "tsu", weight: 1 },
  { hiragana: "て", romanji: "te", weight: 1 },
  { hiragana: "と", romanji: "to", weight: 1 },
  { hiragana: "な", romanji: "na", weight: 1 },
  { hiragana: "に", romanji: "ni", weight: 1 },
  { hiragana: "ぬ", romanji: "nu", weight: 1 },
  { hiragana: "ね", romanji: "ne", weight: 1 },
  { hiragana: "の", romanji: "no", weight: 1 },
  { hiragana: "は", romanji: "ha", weight: 1 },
  { hiragana: "ひ", romanji: "hi", weight: 1 },
  { hiragana: "ふ", romanji: "fu", weight: 1 },
  { hiragana: "へ", romanji: "he", weight: 1 },
  { hiragana: "ほ", romanji: "ho", weight: 1 },
  { hiragana: "ま", romanji: "ma", weight: 1 },
  { hiragana: "み", romanji: "mi", weight: 1 },
  { hiragana: "む", romanji: "mu", weight: 1 },
  { hiragana: "め", romanji: "me", weight: 1 },
  { hiragana: "も", romanji: "mo", weight: 1 },
  { hiragana: "や", romanji: "ya", weight: 1 },
  { hiragana: "ゆ", romanji: "yu", weight: 1 },
  { hiragana: "よ", romanji: "yo", weight: 1 },
  { hiragana: "ら", romanji: "ra", weight: 1 },
  { hiragana: "り", romanji: "ri", weight: 1 },
  { hiragana: "る", romanji: "ru", weight: 1 },
  { hiragana: "れ", romanji: "re", weight: 1 },
  { hiragana: "ろ", romanji: "ro", weight: 1 },
  { hiragana: "わ", romanji: "wa", weight: 1 },
  { hiragana: "を", romanji: "wo", weight: 1 },
  { hiragana: "ん", romanji: "n", weight: 1 },
];


const tableColumns = [
  { key: 'hiragana', header: 'Hiragana' },
  { key: 'romanji', header: 'Romanji' },
  { key: 'correct_answer', header: 'Correct Answers' },
  { key: 'total_answer', header: 'Total Answers' },
  { key: 'accuracy', header: 'Accuracy (%)' },
];

const tableTitle = 'Hiragana Performance'
const kanaType = 'hiragana'


const RandomHiragana = () => {
  const navigate = useNavigate();
  const [currentHiragana, setCurrentHiragana] = useState(initialHiraganaCharacters[0]);
  const [inputValue, setInputValue] = useState('');
  const [correctMsg, setCorrectMsg] = useState('');
  const [incorrectMsg, setIncorrectMsg] = useState('');
  const [performanceData, setPerformanceData] = useState([]);

  const getRandomHiragana = useCallback((hiraganaData) => {
    return getRandomCharacter(hiraganaData);
  }, []);

  const fetchAndUpdateHiragana = useCallback(async () => {
    const updatedCharWeight = await updateKanaWeight(initialHiraganaCharacters, kanaType)
    setCurrentHiragana(getRandomHiragana(updatedCharWeight));
  }, [getRandomHiragana]);

  const getHiraganaPerformance = useCallback(async () => {
      await getKanaPerformance(setPerformanceData, kanaType)
  }, [setPerformanceData]);

  useEffect(() => {
    fetchAndUpdateHiragana();
    getHiraganaPerformance();
  }, [fetchAndUpdateHiragana, getHiraganaPerformance]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isCorrect = inputValue.toLowerCase() === currentHiragana.romanji;

    try {
      await submitAnswer(kanaType, inputValue, currentHiragana, isCorrect)

      if (isCorrect) {
        setCorrectMsg('Correct!');
        setIncorrectMsg('');
      } else {
        setIncorrectMsg(`Incorrect. It is <b>${currentHiragana.romanji}</b>`);
        setCorrectMsg('');
      }

      // These can be parallelized
      await Promise.all([
        getHiraganaPerformance(),
        fetchAndUpdateHiragana()
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
        <h1 className="title">Hiragana Flashcard</h1>
        <button className="backButton" onClick={() => navigate('/')}>Back</button>
      </div>
      <div className="kanaBox">
        <div className="kanaCard">
          <h1 className="kanaCharacter">{currentHiragana.hiragana || 'Loading...'}</h1>
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

export default RandomHiragana;
