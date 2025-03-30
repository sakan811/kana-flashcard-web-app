import React, {useState, useRef, useEffect} from 'react';
import './kanaPerformanceTable.css';
import { KanaPerformanceData } from '../../lib/api-service';
import { Character } from '../../types';

// Define types for the props
interface Column {
  key: string;
  header: string;
}

interface KanaPerformanceTableProps {
  performanceData: KanaPerformanceData[];
  columns: Column[];
  title: string;
  kanaType: 'hiragana' | 'katakana'; // Used in showKana.tsx to set column headers
}

// Map to store romanji values for kana characters
const kanaToRomanjiMap: Record<string, string> = {};

const KanaPerformanceTable: React.FC<KanaPerformanceTableProps> = (
    { performanceData, columns, title }
) => {
  const [showTable, setShowTable] = useState<boolean>(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Initialize the kana to romanji map if not done already
  useEffect(() => {
    if (Object.keys(kanaToRomanjiMap).length === 0) {
      try {
        const characters: Character[] = JSON.parse(localStorage.getItem('kanaCharacters') || '[]');
        if (characters.length > 0) {
          characters.forEach(char => {
            if (char.hiragana) kanaToRomanjiMap[char.hiragana] = char.romanji;
            if (char.katakana) kanaToRomanjiMap[char.katakana] = char.romanji;
          });
        }
      } catch (error) {
        console.error('Error loading kana characters:', error);
      }
    }
  }, []);

  const toggleTable = (): void => {
    setShowTable(prevShowTable => !prevShowTable);
  };

  useEffect(() => {
    if (showTable && tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showTable]); // Only runs when showTable changes

  // Helper to get the correct property value
  const getCellValue = (item: KanaPerformanceData, column: Column): React.ReactNode => {
    switch (column.key) {
      case 'hiragana':
      case 'katakana':
        return item.kana;
      case 'romanji':
        // Use the kanaToRomanjiMap to look up the romanji
        return kanaToRomanjiMap[item.kana] || '';
      case 'accuracy':
        return Math.round(item.accuracy);
      default:
        // Access via string key for other performance properties like correctCount and totalCount
        return item[column.key as keyof KanaPerformanceData];
    }
  };

  return (
    <>
      <div className="kanaPerformanceButtonContainer">
        <button
          onClick={toggleTable}
          className="kanaPerformanceButton"
        >
          {showTable ? 'Hide Performance Table' : 'Show Performance Table'}
        </button>
      </div>
      {showTable && (
        <div className="kanaPerformanceTableContainer" ref={tableRef}>
          <h2 className="kanaPerformanceTableTitle">{title}</h2>
          <div className="table-responsive">
            <table className="kanaPerformanceTable">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key}>{column.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {performanceData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center">No performance data yet</td>
                  </tr>
                ) : (
                  performanceData.map((item, index) => (
                    <tr key={index}>
                      {columns.map((column) => (
                        <td key={column.key}>{getCellValue(item, column)}</td>
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
};

export default KanaPerformanceTable;
