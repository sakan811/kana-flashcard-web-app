const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to PostgreSQL
const sequelize = new Sequelize('kana_db', 'postgres', '625143', {
  host: 'localhost',
  dialect: 'postgres',
});

// Define a model
const KatakanaAnswer = sequelize.define('KatakanaAnswer', {
  answer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  katakana: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  romanji: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

// Sync database
sequelize.sync().then(() => {
  console.log('Database synced');
});

// Define routes
app.post('/katakana-answer', async (req, res) => {
  const { answer, katakana, romanji, is_correct } = req.body;

  try {
    const newAnswer = await KatakanaAnswer.create({
      answer,
      katakana,
      romanji,
      is_correct,
    });
    res.status(201).json(newAnswer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.get('/katakana-percentages', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT
        katakana,
        romanji,
        COUNT(*) AS total_count,
        SUM(CASE WHEN is_correct = true THEN 1 ELSE 0 END) AS correct_count,
        (SUM(CASE WHEN is_correct = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS correct_percentage
      FROM public."KatakanaAnswers"
      GROUP BY katakana, romanji;
    `);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get('/katakana-performance', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT *
      FROM public."KatakanaAnswers";
    `);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
