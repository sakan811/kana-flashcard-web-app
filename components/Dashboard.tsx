"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const [stats, setStats] = useState<KanaStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "hiragana" | "katakana">("all");

  useEffect(() => {
    if (session?.user) {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStats =
    filter === "all"
      ? stats
      : stats.filter((kana) => {
          // Simple heuristic: hiragana characters typically have Unicode values between 0x3040 and 0x309F
          const isHiragana =
            kana.character.charCodeAt(0) >= 0x3040 &&
            kana.character.charCodeAt(0) <= 0x309f;
          return filter === "hiragana" ? isHiragana : !isHiragana;
        });

  const averageAccuracy =
    filteredStats.length > 0
      ? filteredStats
          .filter((kana) => kana.attempts > 0)
          .reduce((sum, kana) => sum + kana.accuracy, 0) /
        filteredStats.filter((kana) => kana.attempts > 0).length
      : 0;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 pl-4 pt-4">
          Dashboard
        </h1>
        <Link
          href="/"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors mt-4 mr-4"
        >
          Back to Home
        </Link>
      </div>

      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Your Progress
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-md bg-blue-50 p-4 text-center">
            <p className="text-sm text-gray-600">Total Characters Practiced</p>
            <p className="text-2xl font-bold text-blue-700">
              {filteredStats.filter((s) => s.attempts > 0).length}
            </p>
          </div>
          <div className="rounded-md bg-green-50 p-4 text-center">
            <p className="text-sm text-gray-600">Average Accuracy</p>
            <p className="text-2xl font-bold text-green-700">
              {(averageAccuracy * 100).toFixed(1)}%
            </p>
          </div>
          <div className="rounded-md bg-purple-50 p-4 text-center">
            <p className="text-sm text-gray-600">Total Attempts</p>
            <p className="text-2xl font-bold text-purple-700">
              {filteredStats.reduce((sum, kana) => sum + kana.attempts, 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Character Accuracy
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded px-3 py-1 text-sm ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("hiragana")}
              className={`rounded px-3 py-1 text-sm ${
                filter === "hiragana"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Hiragana
            </button>
            <button
              onClick={() => setFilter("katakana")}
              className={`rounded px-3 py-1 text-sm ${
                filter === "katakana"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Katakana
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pt-2 text-sm font-semibold text-gray-600">
                  Character
                </th>
                <th className="pb-2 pt-2 text-sm font-semibold text-gray-600">
                  Romaji
                </th>
                <th className="pb-2 pt-2 text-sm font-semibold text-gray-600">
                  Attempts
                </th>
                <th className="pb-2 pt-2 text-sm font-semibold text-gray-600">
                  Accuracy
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStats
                .sort((a, b) => a.accuracy - b.accuracy)
                .map((kana) => (
                  <tr key={kana.id} className="border-b">
                    <td className="py-3 text-2xl">{kana.character}</td>
                    <td className="py-3">{kana.romaji}</td>
                    <td className="py-3">{kana.attempts}</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-20 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${kana.accuracy * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">
                          {(kana.accuracy * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
