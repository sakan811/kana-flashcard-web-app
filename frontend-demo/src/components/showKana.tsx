import React, { useState, useEffect, useCallback, FormEvent, ChangeEvent } from 'react';
import './showKana.css';
import { getRandomCharacter, getHiraganaList, getKatakanaList, Character } from './funcs/utilsFunc';
import KanaPerformanceTable from './performanceTable/kanaPerformanceTable';
import {useNavigate, useParams} from 'react-router-dom';
import {initializeKanaPerformanceData, PerformanceData} from "./funcs/showKanaFunc";


const tableColumns = [
  { key: 'kana', header: 'Kana' },
  { key: 'romanji', header: 'Romanji' },
  { key: 'correct_answer', header: 'Correct Answers' },
  { key: 'total_answer', header: 'Total Answers' },
  { key: 'accuracy', header: 'Accuracy (%)' },
];

const RandomKana: React.FC = () => {
  const { kanaType } = useParams<{ kanaType: 'hiragana' | 'katakana' }>();

  // Choose the correct kana set based on the URL parameter
  const initialKanaCharacters: Character[] = kanaType === 'hiragana' ? getHiraganaList() : getKatakanaList();

  const tableTitle = kanaType
    ? `${kanaType.charAt(0).toUpperCase() + kanaType.slice(1)} Performance`
    : 'Performance';

  const navigate = useNavigate();

  const [currentKana, setCurrentKana] = useState<Character>(initialKanaCharacters[0]);
  const [inputValue, setInputValue] = useState<string>('');
  const [message, setMessage] = useState<{ correct: string; incorrect: string }>({ correct: '', incorrect: '' });
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);

  const getRandomKana = useCallback((kanaData: Character[]): Character => {
    return getRandomCharacter(kanaData) as Character;
  }, []);

  // Fetch performance data from sessionStorage
  const getKanaPerformanceFromSession = useCallback(() => {
    const storedData = sessionStorage.getItem(`${kanaType}-performance`);
    if (storedData) {
      setPerformanceData(JSON.parse(storedData));
    } else {
      // Initialize performance data if it's not in session storage
      const initialData = initializeKanaPerformanceData(kanaType, initialKanaCharacters);
      setPerformanceData(initialData);
      sessionStorage.setItem(`${kanaType}-performance`, JSON.stringify(initialData));
    }
  }, []);

  // Update sessionStorage with new performance data
  const updateSessionPerformance = (updatedData: PerformanceData[]) => {
    sessionStorage.setItem(`${kanaType}-performance`, JSON.stringify(updatedData));
  };

  const fetchAndUpdateKana = useCallback(() => {
    setCurrentKana(getRandomKana(initialKanaCharacters));
  }, [getRandomKana]);

  useEffect(() => {
    fetchAndUpdateKana();
    getKanaPerformanceFromSession();
  }, [fetchAndUpdateKana, getKanaPerformanceFromSession]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isCorrect = inputValue.toLowerCase() === currentKana.romanji;

    const updatedPerformanceData = performanceData.map((data) => {
      if (data.kana === (kanaType === 'hiragana' ? currentKana.hiragana : currentKana.katakana)) {
        const updatedTotal = data.total_answer + 1;
        const updatedCorrect = isCorrect ? data.correct_answer + 1 : data.correct_answer;
        const accuracy = Math.round((updatedCorrect / updatedTotal) * 100);
        return {
          ...data,
          correct_answer: updatedCorrect,
          total_answer: updatedTotal,
          accuracy,
        };
      }
      return data;
    });

    setPerformanceData(updatedPerformanceData);
    updateSessionPerformance(updatedPerformanceData);

    setMessage({
      correct: isCorrect ? 'Correct!' : '',
      incorrect: !isCorrect ? `Incorrect. It is <b>${currentKana.romanji}</b>` : '',
    });

    fetchAndUpdateKana();
    setInputValue('');

    setTimeout(() => setMessage({ correct: '', incorrect: '' }), 1000);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <div className="titleContainer">
          <h1 className="title">{kanaType === 'hiragana' ? 'Hiragana Flashcard' : 'Katakana Flashcard'}</h1>
          <button className="backButton" onClick={() => navigate('/')}>Back</button>
      </div>
        <div className="kanaBox">
        <div className="kanaCard">
          <h1 className="kanaCharacter">{kanaType === 'hiragana' ? currentKana.hiragana : currentKana.katakana}</h1>
        </div>
      </div>
      <form id="romanjiForm" onSubmit={handleSubmit} role="form">
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
      {message.correct && <p className="correctMsg">{message.correct}</p>}
      {message.incorrect && <p className="incorrectMsg" dangerouslySetInnerHTML={{ __html: message.incorrect }}></p>}
      <KanaPerformanceTable performanceData={performanceData} columns={tableColumns} title={tableTitle} />
    </>
  );
};

export default RandomKana;
