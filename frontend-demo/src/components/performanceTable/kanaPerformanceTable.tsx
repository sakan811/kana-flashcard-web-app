import React, {useState, useRef, useEffect} from 'react';
import { Table, Button } from 'react-bootstrap';
import './kanaPerformanceTable.css';

// Define types for the props
interface Column {
  key: string;
  header: string;
}

interface PerformanceItem {
  [key: string]: React.ReactNode;
}

interface KanaPerformanceTableProps {
  performanceData: PerformanceItem[];
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
    if (showTable && tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showTable]); // Only runs when showTable changes

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
              {performanceData.map((item: PerformanceItem, index: number) => (
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
