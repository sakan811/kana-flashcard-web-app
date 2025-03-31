/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect, memo } from "react";
import { Character, KanaPerformanceData, KanaType } from "@/types";

// Define types for the props
interface Column {
  key: string;
  header: string;
}

interface KanaPerformanceTableProps {
  performanceData: KanaPerformanceData[];
  columns: Column[];
  title: string;
  kanaType: KanaType;
}

// Map to store romaji values for kana characters
const kanaToRomajiMap: Record<string, string> = {};

const KanaPerformanceTable: React.FC<KanaPerformanceTableProps> = memo(
  ({ performanceData, columns, title }) => {
    const [showTable, setShowTable] = useState<boolean>(false);
    const tableRef = useRef<HTMLDivElement>(null);
    const mappingInitializedRef = useRef<boolean>(false);

    // Initialize the kana to romaji map if not done already
    useEffect(() => {
      if (mappingInitializedRef.current) return;

      try {
        const characters: Character[] = JSON.parse(
          localStorage.getItem("kanaCharacters") || "[]",
        );
        if (characters.length > 0) {
          characters.forEach((char) => {
            if (char.kana) {
              kanaToRomajiMap[char.kana] = char.romanji;
            }
          });
          mappingInitializedRef.current = true;
        }
      } catch (error) {
        console.error("Error loading kana characters:", error);
      }
    }, []);

    const toggleTable = (): void => {
      setShowTable((prevShowTable) => !prevShowTable);
    };

    useEffect(() => {
      if (showTable && tableRef.current) {
        tableRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [showTable]); // Only runs when showTable changes

    // Helper to get the correct property value
    const getCellValue = (
      item: KanaPerformanceData,
      column: Column,
    ): React.ReactNode => {
      switch (column.key) {
        case "hiragana":
        case "katakana":
        case "kana":
          return item.kana;
        case "romaji":
          // Use the kanaToRomajiMap to look up the romaji
          return kanaToRomajiMap[item.kana] || "";
        case "accuracy":
          return Math.round(item.accuracy);
        case "lastPracticed":
        case "createdAt":
        case "updatedAt":
          // Convert Date objects to string
          const dateValue = item[column.key as keyof KanaPerformanceData];
          if (dateValue instanceof Date) {
            return dateValue.toLocaleDateString();
          }
          return String(dateValue);
        default:
          // Access via string key for other performance properties like correctCount and totalCount
          const value = item[column.key as keyof KanaPerformanceData];
          return typeof value === "object" ? String(value) : value;
      }
    };

    // Sort the performance data by accuracy in ascending order
    const sortedPerformanceData = React.useMemo(
      () => [...performanceData].sort((a, b) => a.accuracy - b.accuracy),
      [performanceData],
    );

    return (
      <>
        <div className="flex justify-center mt-6">
          <button
            onClick={toggleTable}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
          >
            {showTable ? "Hide Performance Table" : "Show Performance Table"}
          </button>
        </div>
        {showTable && (
          <div
            className="mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
            ref={tableRef}
          >
            <h2 className="text-xl font-bold p-4 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              {title}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedPerformanceData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        No performance data yet
                      </td>
                    </tr>
                  ) : (
                    sortedPerformanceData.map((item, index) => (
                      <tr
                        key={index}
                        className={`${index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"} hover:bg-gray-100 dark:hover:bg-gray-600`}
                      >
                        {columns.map((column) => (
                          <td
                            key={column.key}
                            className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white"
                          >
                            {getCellValue(item, column)}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  },
);

// Add display name for debugging purposes
KanaPerformanceTable.displayName = "KanaPerformanceTable";

export default KanaPerformanceTable;
