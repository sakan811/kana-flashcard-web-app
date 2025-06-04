/*
 * SakuMari - Japanese Kana Flashcard App
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

import { useState, useEffect } from "react";
import Link from "next/link";

type KanaStats = {
  id: string;
  character: string;
  romaji: string;
  attempts: number;
  correct_attempts: number;
  accuracy: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<KanaStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "hiragana" | "katakana">("all");
  const [sortColumn, setSortColumn] = useState<
    "character" | "romaji" | "attempts" | "accuracy"
  >("accuracy");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const fetchStats = async () => {
    try {
      setError(null);
      const response = await fetch("/api/stats");
      if (!response.ok) {
        if (response.status === 401) {
          setError("Please sign in to view your progress");
          return;
        }
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }
      const data = await response.json();
      setStats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to load progress data");
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSort = (
    column: "character" | "romaji" | "attempts" | "accuracy",
  ) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedStats = [
    ...(filter === "all"
      ? stats
      : stats.filter((kana) => {
          const charCode = kana.character.charCodeAt(0);
          const isHiragana = charCode >= 0x3040 && charCode <= 0x309f;
          const isKatakana = charCode >= 0x30a0 && charCode <= 0x30ff;
          
          if (filter === "hiragana") {
            return isHiragana;
          } else if (filter === "katakana") {
            return isKatakana;
          }
          return false;
        })),
  ].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortColumn) {
      case "character":
        aValue = a.character;
        bValue = b.character;
        break;
      case "romaji":
        aValue = a.romaji;
        bValue = b.romaji;
        break;
      case "attempts":
        aValue = a.attempts;
        bValue = b.attempts;
        break;
      case "accuracy":
        aValue = a.accuracy;
        bValue = b.accuracy;
        break;
      default:
        return 0;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === "asc" ? comparison : -comparison;
    } else {
      const comparison = (aValue as number) - (bValue as number);
      return sortDirection === "asc" ? comparison : -comparison;
    }
  });

  const filteredStats = sortedStats;
  const practicedStats = filteredStats.filter((kana) => kana.attempts > 0);

  const averageAccuracy =
    practicedStats.length > 0
      ? practicedStats.reduce((sum, kana) => sum + kana.accuracy, 0) / practicedStats.length
      : 0;

  const totalAttempts = filteredStats.reduce((sum, kana) => sum + kana.attempts, 0);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#fad182] to-[#f5c55a] min-h-screen">
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d1622b] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#fad182] to-[#f5c55a] min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#403933] pl-4 pt-4 drop-shadow-sm">
          Dashboard
        </h1>
        <Link
          href="/"
          className="rounded-lg bg-[#d1622b] px-6 py-3 text-white hover:bg-[#ae0d13] transition-all duration-200 mt-4 mr-4 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d1622b] hover:border-[#ae0d13] font-medium"
        >
          Back to Home
        </Link>
      </div>

      {error ? (
        <div className="mb-6 rounded-lg bg-red-100 border-2 border-red-300 p-6 mx-4">
          <p className="text-red-800 text-center font-medium">{error}</p>
          <div className="text-center mt-4">
            <button
              onClick={fetchStats}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 rounded-lg bg-white/90 backdrop-blur-sm p-6 shadow-xl border-2 border-[#705a39] mx-4">
            <h2 className="mb-4 text-xl font-semibold text-[#403933]">
              Your Progress
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-md bg-gradient-to-br from-[#705a39] to-[#403933] p-4 text-center shadow-lg border-2 border-[#403933]">
                <p className="text-sm text-[#fad182] font-medium">
                  Total Characters Practiced
                </p>
                <p className="text-2xl font-bold text-white">
                  {practicedStats.length}
                </p>
              </div>
              <div className="rounded-md bg-gradient-to-br from-green-600 to-green-700 p-4 text-center shadow-lg border-2 border-green-700">
                <p className="text-sm text-green-100 font-medium">
                  Average Accuracy
                </p>
                <p className="text-2xl font-bold text-white">
                  {practicedStats.length > 0 ? (averageAccuracy * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div className="rounded-md bg-gradient-to-br from-[#d1622b] to-[#ae0d13] p-4 text-center shadow-lg border-2 border-[#ae0d13]">
                <p className="text-sm text-orange-100 font-medium">
                  Total Attempts
                </p>
                <p className="text-2xl font-bold text-white">
                  {totalAttempts}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white/90 backdrop-blur-sm p-6 shadow-xl border-2 border-[#705a39] mx-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#403933]">
                Character Progress
              </h2>
              <div className="flex gap-2">
                <button
                  data-testid="filter-all"
                  onClick={() => setFilter("all")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 border-2 ${
                    filter === "all"
                      ? "bg-[#d1622b] text-white border-[#d1622b] shadow-lg"
                      : "bg-white text-[#705a39] border-[#705a39] hover:bg-[#fad182] hover:border-[#d1622b]"
                  }`}
                >
                  All
                </button>
                <button
                  data-testid="filter-hiragana"
                  onClick={() => setFilter("hiragana")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 border-2 ${
                    filter === "hiragana"
                      ? "bg-[#d1622b] text-white border-[#d1622b] shadow-lg"
                      : "bg-white text-[#705a39] border-[#705a39] hover:bg-[#fad182] hover:border-[#d1622b]"
                  }`}
                >
                  Hiragana
                </button>
                <button
                  data-testid="filter-katakana"
                  onClick={() => setFilter("katakana")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 border-2 ${
                    filter === "katakana"
                      ? "bg-[#d1622b] text-white border-[#d1622b] shadow-lg"
                      : "bg-white text-[#705a39] border-[#705a39] hover:bg-[#fad182] hover:border-[#d1622b]"
                  }`}
                >
                  Katakana
                </button>
              </div>
            </div>

            {filteredStats.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#705a39] text-lg mb-4">
                  No character data available yet.
                </p>
                <p className="text-[#705a39] mb-6">
                  Start practicing to see your progress here!
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/hiragana"
                    className="bg-[#d1622b] text-white px-6 py-3 rounded-lg hover:bg-[#ae0d13] transition-colors font-medium"
                  >
                    Practice Hiragana
                  </Link>
                  <Link
                    href="/katakana"
                    className="bg-[#705a39] text-white px-6 py-3 rounded-lg hover:bg-[#403933] transition-colors font-medium"
                  >
                    Practice Katakana
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b-2 border-[#705a39] text-left">
                      <th
                        data-testid="sort-character"
                        className="pb-3 pt-2 text-sm font-semibold text-[#403933] cursor-pointer hover:text-[#d1622b] select-none transition-colors duration-200"
                        onClick={() => handleSort("character")}
                      >
                        <div className="flex items-center gap-1">
                          Character
                          {sortColumn === "character" && (
                            <span className="text-[#d1622b] text-lg">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        data-testid="sort-romaji"
                        className="pb-3 pt-2 text-sm font-semibold text-[#403933] cursor-pointer hover:text-[#d1622b] select-none transition-colors duration-200"
                        onClick={() => handleSort("romaji")}
                      >
                        <div className="flex items-center gap-1">
                          Romaji
                          {sortColumn === "romaji" && (
                            <span className="text-[#d1622b] text-lg">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        data-testid="sort-attempts"
                        className="pb-3 pt-2 text-sm font-semibold text-[#403933] cursor-pointer hover:text-[#d1622b] select-none transition-colors duration-200"
                        onClick={() => handleSort("attempts")}
                      >
                        <div className="flex items-center gap-1">
                          Attempts
                          {sortColumn === "attempts" && (
                            <span className="text-[#d1622b] text-lg">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        data-testid="sort-accuracy"
                        className="pb-3 pt-2 text-sm font-semibold text-[#403933] cursor-pointer hover:text-[#d1622b] select-none transition-colors duration-200"
                        onClick={() => handleSort("accuracy")}
                      >
                        <div className="flex items-center gap-1">
                          Accuracy
                          {sortColumn === "accuracy" && (
                            <span className="text-[#d1622b] text-lg">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStats.map((kana, index) => (
                      <tr
                        key={kana.id}
                        className={`border-b border-[#705a39]/30 ${index % 2 === 0 ? "bg-white/50" : "bg-[#fad182]/20"} hover:bg-[#fad182]/40 transition-colors duration-200`}
                      >
                        <td className="py-3 text-2xl text-[#403933]">
                          {kana.character}
                        </td>
                        <td className="py-3 text-[#705a39] font-medium">
                          {kana.romaji}
                        </td>
                        <td className="py-3 text-[#403933] font-medium">
                          {kana.attempts}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="mr-3 h-3 w-24 rounded-full bg-[#705a39]/30 border border-[#705a39]/50">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#d1622b] to-[#ae0d13] transition-all duration-300"
                                style={{ width: `${kana.accuracy * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-[#403933]">
                              {(kana.accuracy * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}