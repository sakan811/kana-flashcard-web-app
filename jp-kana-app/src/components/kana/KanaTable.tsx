import React from "react";
import KanaPerformanceTable from "../performanceTable/kanaPerformanceTable";
import { KanaType, KanaPerformanceData } from "@/types";
import { getKanaTableColumns } from "@/config/tableColumns";

interface KanaTableProps {
  kanaType: KanaType;
  performanceData: KanaPerformanceData[];
}

const KanaTable: React.FC<KanaTableProps> = ({ kanaType, performanceData }) => {
  const tableColumns = getKanaTableColumns(kanaType);
  const tableTitle = `${kanaType.charAt(0).toUpperCase() + kanaType.slice(1)} Performance`;

  return (
    <div className="mt-8">
      <KanaPerformanceTable
        performanceData={performanceData}
        columns={tableColumns}
        title={tableTitle}
        kanaType={kanaType}
      />
    </div>
  );
};

export default KanaTable;
