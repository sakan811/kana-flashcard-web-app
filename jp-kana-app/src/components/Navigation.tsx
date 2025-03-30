'use client';

import React from 'react';
import Link from 'next/link';

const Navigation: React.FC = () => {
  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-content">
          <div className="nav-item">
            <Link href="/" className="nav-link">
              Kana Flashcards
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 