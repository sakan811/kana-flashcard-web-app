import React, {useState, useEffect, useCallback, FormEvent, ChangeEvent} from 'react';
import './css/showKana.css';
import {getKatakanaList, getRandomCharacter, Character} from "./funcs/utilsFunc";
import KanaPerformanceTable from "./kanaPerformanceTable";
import {useNavigate} from "react-router-dom";
import {updateKanaWeight, submitAnswer} from "./funcs/showKanaFunc";
import axios from "axios";

interface PerformanceData {
  katakana: string;
  romanji: string;
  correct_answer: number;
  total_answer: number;
  accuracy: number;
}


// Initialize with equal weights
const initialKatakanaCharacters = getKatakanaList()


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
  const [currentKatakana, setCurrentKatakana] = useState<Character>(initialKatakanaCharacters[0]);
  const [inputValue, setInputValue] = useState<string>('');
  const [correctMsg, setCorrectMsg] = useState<string>('');
  const [incorrectMsg, setIncorrectMsg] = useState<string>('');
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);

  const getRandomKatakana = useCallback((katakanaData: Character[]): Character => {
    return getRandomCharacter(katakanaData) as Character;
  }, []);

  const fetchAndUpdateKatakana = useCallback(async () => {
    const updatedCharWeight = await updateKanaWeight(initialKatakanaCharacters, kanaType)
    setCurrentKatakana(getRandomKatakana(updatedCharWeight));
  }, [getRandomKatakana]);

  const getKatakanaPerformance = useCallback(async () => {
    try {
        const response = await axios.get(`http://localhost:5000/${kanaType}-performance`);
        setPerformanceData(response.data);
    } catch (error) {
        console.error(`Error fetching ${kanaType} performance:`, error);
    }
  }, [setPerformanceData]);

  useEffect(() => {
    fetchAndUpdateKatakana();
    getKatakanaPerformance();
  }, [fetchAndUpdateKatakana, getKatakanaPerformance]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
