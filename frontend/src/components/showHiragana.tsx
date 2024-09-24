import React, {useState, useEffect, useCallback, FormEvent, ChangeEvent} from 'react';
import './showKana.css';
import {getRandomCharacter, getHiraganaList, Character} from "./funcs/utilsFunc";
import KanaPerformanceTable from "./kanaPerformanceTable";
import {updateKanaWeight, submitAnswer} from "./funcs/showKanaFunc";
import {useNavigate} from "react-router-dom";
import axios from "axios";

interface PerformanceData {
  hiragana: string;
  romanji: string;
  correct_answer: number;
  total_answer: number;
  accuracy: number;
}

// Initialize with equal weights
const initialHiraganaCharacters: Character[] = getHiraganaList()

const tableColumns = [
  { key: 'hiragana', header: 'Hiragana' },
  { key: 'romanji', header: 'Romanji' },
  { key: 'correct_answer', header: 'Correct Answers' },
  { key: 'total_answer', header: 'Total Answers' },
  { key: 'accuracy', header: 'Accuracy (%)' },
];

const tableTitle = 'Hiragana Performance';
const kanaType = 'hiragana';

const RandomHiragana: React.FC = () => {
  const navigate = useNavigate();
  const [currentHiragana, setCurrentHiragana] = useState<Character>(initialHiraganaCharacters[0]);
  const [inputValue, setInputValue] = useState<string>('');
  const [correctMsg, setCorrectMsg] = useState<string>('');
  const [incorrectMsg, setIncorrectMsg] = useState<string>('');
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);

  const getRandomHiragana = useCallback((hiraganaData: Character[]): Character => {
    return getRandomCharacter(hiraganaData) as Character;
  }, []);

  const fetchAndUpdateHiragana = useCallback(async () => {
    const updatedCharWeight = await updateKanaWeight(initialHiraganaCharacters, kanaType);
    setCurrentHiragana(getRandomHiragana(updatedCharWeight));
  }, [getRandomHiragana]);

  const getHiraganaPerformance = useCallback(async () => {
    try {
        const response = await axios.get(`http://localhost:5000/${kanaType}-performance`);
        setPerformanceData(response.data);
    } catch (error) {
        console.error(`Error fetching ${kanaType} performance:`, error);
    }
  }, [setPerformanceData]);

  useEffect(() => {
    fetchAndUpdateHiragana();
    getHiraganaPerformance();
  }, [fetchAndUpdateHiragana, getHiraganaPerformance]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isCorrect = inputValue.toLowerCase() === currentHiragana.romanji;

    try {
      await submitAnswer(kanaType, inputValue, currentHiragana, isCorrect);

      if (isCorrect) {
        setCorrectMsg('Correct!');
        setIncorrectMsg('');
      } else {
        setIncorrectMsg(`Incorrect. It is <b>${currentHiragana.romanji}</b>`);
        setCorrectMsg('');
      }

      await Promise.all([
        getHiraganaPerformance(),
        fetchAndUpdateHiragana(),
      ]);

      setInputValue('');

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