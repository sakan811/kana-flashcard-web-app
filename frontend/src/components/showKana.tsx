import React, {useState, useEffect, useCallback, FormEvent, ChangeEvent} from 'react';
import './showKana.css';
import {getRandomCharacter, getHiraganaList, Character, getKatakanaList} from "./funcs/utilsFunc";
import KanaPerformanceTable from "./performanceTable/kanaPerformanceTable";
import {updateKanaWeight, submitAnswer} from "./funcs/showKanaFunc";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const RandomKana: React.FC = () => {
  const { kanaType } = useParams<{ kanaType: 'hiragana' | 'katakana' }>();
  const navigate = useNavigate();

  // Choose the correct kana set based on the URL parameter
  const initialKanaCharacters: Character[] = kanaType === 'hiragana' ? getHiraganaList() : getKatakanaList();

  const tableColumns = [
    { key: kanaType === 'hiragana' ? 'hiragana' : 'katakana', header: kanaType === 'hiragana' ? 'Hiragana' : 'Katakana' },
    { key: 'romanji', header: 'Romanji' },
    { key: 'correct_answer', header: 'Correct Answers' },
    { key: 'total_answer', header: 'Total Answers' },
    { key: 'accuracy', header: 'Accuracy (%)' },
  ];

  const [currentKana, setCurrentKana] = useState<Character>(initialKanaCharacters[0]);
  const [inputValue, setInputValue] = useState<string>('');
  const [message, setMessage] = useState<{ correct: string; incorrect: string }>({ correct: '', incorrect: '' });
  const [performanceData, setPerformanceData] = useState<Record<string, string | number>[]>([]);

  const tableTitle = kanaType
    ? `${kanaType.charAt(0).toUpperCase() + kanaType.slice(1)} Performance`
    : 'Performance';

  const getRandomKana = useCallback((kanaData: Character[]): Character => {
    return getRandomCharacter(kanaData) as Character;
  }, []);

  const fetchAndUpdateKana = useCallback(async () => {
    const updatedCharWeight = await updateKanaWeight(initialKanaCharacters, kanaType);
    setCurrentKana(getRandomKana(updatedCharWeight));
  }, [getRandomKana]);

  const getKanaPerformance = useCallback(async () => {
    const validKanaTypes = ['hiragana', 'katakana'];
    if (typeof kanaType === 'string' && validKanaTypes.includes(kanaType)) {
      try {
        const response = await axios.get(`http://localhost:5000/${kanaType}-performance`);
        setPerformanceData(response.data);
      } catch (error) {
        console.error(`Error fetching ${kanaType} performance:`, error);
        setPerformanceData([]);
      }
    }
    else {
      console.error('Invalid kana type');
      setPerformanceData([]);
      return;
    }
  }, [kanaType, setPerformanceData]);

  useEffect(() => {
    fetchAndUpdateKana();
    getKanaPerformance();
  }, [fetchAndUpdateKana, getKanaPerformance]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isCorrect = inputValue.toLowerCase() === currentKana.romanji;

    try {
      await submitAnswer(kanaType, inputValue, currentKana, isCorrect);

      setMessage({
          correct: isCorrect ? 'Correct!' : '',
          incorrect: !isCorrect ? `Incorrect. It is <b>${currentKana.romanji}</b>` : '',
      });

      await Promise.all([
        getKanaPerformance(),
        fetchAndUpdateKana(),
      ]);

      setInputValue('');

      setTimeout(() => setMessage({ correct: '', incorrect: '' }), 1000);

    } catch (error) {
      console.error('Error:', error);
      setMessage({ correct: '', incorrect: 'Submission failed. Please try again.'});
    }
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
      {message.correct && <p className="correctMsg">{message.correct}</p>}
      {message.incorrect && <p className="incorrectMsg" dangerouslySetInnerHTML={{ __html: message.incorrect }}></p>}
      {kanaType &&
        <KanaPerformanceTable
          performanceData={performanceData}
          columns={tableColumns}
          title={tableTitle}
          kanaType={kanaType}
        />
      }
    </>
  );
};

export default RandomKana;
