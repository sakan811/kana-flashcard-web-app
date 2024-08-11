const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to PostgreSQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
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

const HiraganaAnswer = sequelize.define('HiraganaAnswer', {
  answer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hiragana: {
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

// Define API endpoints
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
      SELECT
        katakana,
        romanji,
        COUNT(*) AS total_answer,
        SUM(CASE WHEN is_correct = true THEN 1 ELSE 0 END) AS correct_answer,
        (SUM(CASE WHEN is_correct = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS accuracy
      FROM public."KatakanaAnswers"
      GROUP BY katakana, romanji
      order by (SUM(CASE WHEN is_correct = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) desc;
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/hiragana-answer', async (req, res) => {
  const { answer, hiragana, romanji, is_correct } = req.body;

  try {
    const newAnswer = await HiraganaAnswer.create({
      answer,
      hiragana,
      romanji,
      is_correct,
    });
    res.status(201).json(newAnswer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.get('/hiragana-percentages', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT
        hiragana,
        romanji,
        COUNT(*) AS total_count,
        SUM(CASE WHEN is_correct = true THEN 1 ELSE 0 END) AS correct_count,
        (SUM(CASE WHEN is_correct = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS correct_percentage
      FROM public."HiraganaAnswers"
      GROUP BY hiragana, romanji;
    `);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get('/hiragana-performance', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT
        hiragana,
        romanji,
        COUNT(*) AS total_answer,
        SUM(CASE WHEN is_correct = true THEN 1 ELSE 0 END) AS correct_answer,
        (SUM(CASE WHEN is_correct = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS accuracy
      FROM public."HiraganaAnswers"
      GROUP BY hiragana, romanji
      order by (SUM(CASE WHEN is_correct = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) desc;
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Start the server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;