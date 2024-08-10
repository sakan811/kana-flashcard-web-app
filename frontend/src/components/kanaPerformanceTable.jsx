import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import './kanaPerformanceTable.css';

const KanaPerformanceTable = ({ performanceData, columns, title }) => {
  const [showTable, setShowTable] = useState(false);

  const toggleTable = () => {
    setShowTable(!showTable);
  };

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
        <div className="kanaPerformanceTableContainer">
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
              {performanceData.map((item, index) => (
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
