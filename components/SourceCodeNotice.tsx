/*
 * Japanese Kana Flashcard App
 * Copyright (C) 2025  Sakan Nirattisaykul
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

"use client";

import { useState } from "react";

export default function SourceCodeNotice() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#403933] text-[#fad182] px-3 py-2 rounded-lg text-sm hover:bg-[#705a39] transition-colors"
        title="Source Code Information"
      >
        📄 Source
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white border-2 border-[#705a39] rounded-lg p-4 shadow-xl max-w-sm">
          <div className="text-sm text-[#403933]">
            <h3 className="font-bold mb-2">Open Source Software</h3>
            <p className="mb-3">
              This application is free software licensed under the GNU Affero
              General Public License v3.
            </p>
            <div className="space-y-2">
              <a
                href="https://github.com/yourusername/kana-flashcard-web-app"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#d1622b] text-white px-3 py-2 rounded text-center hover:bg-[#ae0d13] transition-colors"
              >
                📁 View Source Code
              </a>
              <a
                href="/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#705a39] text-white px-3 py-2 rounded text-center hover:bg-[#403933] transition-colors"
              >
                📋 View License
              </a>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-3 text-xs text-[#705a39] hover:text-[#403933] underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
