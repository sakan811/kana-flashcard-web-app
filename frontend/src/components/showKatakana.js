import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import './showKatakana.css';
import {getRandomCharacter} from "./funcs/utilsFunc";

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


const RandomKatakana = () => {
  const [currentKatakana, setCurrentKatakana] = useState(initialKatakanaCharacters[0]);
  const [inputValue, setInputValue] = useState('');
  const [correctMsg, setCorrectMsg] = useState('');
  const [incorrectMsg, setIncorrectMsg] = useState('');

  // const getRandomKatakana = useCallback((katakanaData) => {
  //   // Calculate the total weight by summing up the weights of all Katakana characters.
  //   const totalWeight = katakanaData.reduce((sum, { weight }) => sum + weight, 0);
  //
  //   // Generate a random number between 0 and the total weight.
  //   let randomNum = Math.random() * totalWeight;
  //
  //   // Iterate over the Katakana data to find which character the random number falls into.
  //   for (const item of katakanaData) {
  //     // Subtract the weight of the current item from the random number.
  //     randomNum -= item.weight;
  //     // If the random number is now less than or equal to 0, return the current item.
  //     if (randomNum <= 0) {
  //       return item;
  //     }
  //   }
  //
  //   // In case of rounding errors or unexpected situations, return the last item.
  //   return katakanaData[katakanaData.length - 1];
  // }, []);

  const getRandomKatakana = useCallback((katakanaData) => {
    return getRandomCharacter(katakanaData);
  }, []);

  const fetchAndUpdateKatakana = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/katakana-percentages');
      const data = response.data;

      // Update weights based on server data
      const updatedKatakanaData = initialKatakanaCharacters.map(char => {
        const serverData = data.find(item => item.katakana === char.katakana);
        if (serverData) {
          const weight = Math.max(1, 100 - serverData.correct_percentage);
          return { ...char, weight };
        }
        return char;
      });
      setCurrentKatakana(getRandomKatakana(updatedKatakanaData));
    } catch (error) {
      console.error('Error fetching katakana data:', error);
      setCurrentKatakana(getRandomKatakana(initialKatakanaCharacters));
    }
  }, [getRandomKatakana]);


  const getKatakanaPerformance = useCallback(async () => {
        try {
              const response = await axios.get('http://localhost:5000/katakana-performance');
              const data = response.data;
        } catch (error) {
            console.error('Error fetching katakana performance:', error);
        }
      }
  );


  useEffect(() => {
    fetchAndUpdateKatakana();
  }, [fetchAndUpdateKatakana]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isCorrect = inputValue.toLowerCase() === currentKatakana.romanji;

    try {
      await axios.post('http://localhost:5000/katakana-answer/', {
        answer: inputValue,
        katakana: currentKatakana.katakana,
        romanji: currentKatakana.romanji,
        is_correct: isCorrect
      });

      if (isCorrect) {
        setCorrectMsg('Correct!');
        setIncorrectMsg('');
      } else {
        setIncorrectMsg(`Incorrect. It is <b>${currentKatakana.romanji}</b>`);
        setCorrectMsg('');
      }

      // Fetch updated percentages and set new katakana
      setTimeout(() => {
        fetchAndUpdateKatakana();
        setInputValue('');
        setCorrectMsg('');
        setIncorrectMsg('');
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <div className="katakanaTitleContainer">
        <h1 className="katakanaTitle">Katakana Flashcard</h1>
      </div>
      <div className="katakanaBox">
        <div className="katakanaCard">
          <h1 className="katakana">{currentKatakana.katakana || 'Loading...'}</h1>
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
    </>
  );
};

export default RandomKatakana;
