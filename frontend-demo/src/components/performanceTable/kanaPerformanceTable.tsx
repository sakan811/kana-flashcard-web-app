import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Table, Button } from 'react-bootstrap';
import './kanaPerformanceTable.css';
import { PerformanceData } from "@/components/funcs/showKanaFunc";

// Define a type for the keys of PerformanceData
type PerformanceDataKey = keyof PerformanceData;

// Update the Column interface
export interface Column {
  key: PerformanceDataKey;
  header: string;
}

interface KanaPerformanceTableProps {
  performanceData: PerformanceData[];
  columns: Column[];
  title: string;
}

const KanaPerformanceTable: React.FC<KanaPerformanceTableProps> = (
  { performanceData, columns, title }
) => {
  const [showTable, setShowTable] = useState<boolean>(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const toggleTable = (): void => {
    setShowTable(prevShowTable => !prevShowTable);
  };

  useEffect(() => {
    if (showTable) {
      tableRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showTable]);

  // Filter and sort the performance data
  const sortedAndFilteredPerformanceData = useMemo(() =>
    performanceData
      .filter(item => item.total_answer > 0)
      .sort((a, b) => b.accuracy - a.accuracy),
    [performanceData]
  );

  return (
    <>
      <div className="kanaPerformanceButtonContainer">
        <Button
          onClick={toggleTable}
          variant="primary"
          className="kanaPerformanceButton"
        >
          {showTable ? 'Hide Performance Table' : 'Show Performance Table'}
        </Button>
      </div>
      {showTable && (
        <div className="kanaPerformanceTableContainer" ref={tableRef}>
          <h2 className="kanaPerformanceTableTitle">{title}</h2>
          <Table striped bordered hover className="kanaPerformanceTable">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredPerformanceData.map((item: PerformanceData, index: number) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.key}>{item[column.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default KanaPerformanceTable;