'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="home">
      <h1 className="home-title">
        Japanese Kana Flashcard App
      </h1>
      <p className="home-description">
        Learn Japanese kana characters with interactive flashcards. Practice Hiragana and Katakana to improve your Japanese reading skills.
      </p>
      <div className="home-button-container">
        <Link
          href="/hiragana"
          className="home-button"
        >
          Practice Hiragana
        </Link>
        <Link
          href="/katakana"
          className="home-button"
        >
          Practice Katakana
        </Link>
      </div>
    </div>
  );
} 