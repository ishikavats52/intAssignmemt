import React, { useState } from "react";
import Papa from "papaparse";

export default function CSVUploader() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filters, setFilters] = useState({});

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        setColumns(results.meta.fields);
      },
    });
  };

  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
  };

  const filteredData = data.filter((row) => {
    return Object.keys(filters).every((col) => {
      if (!filters[col]) return true;
      return row[col]
        ?.toString()
        .toLowerCase()
        .includes(filters[col].toLowerCase());
    });
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">CSV Upload & Filter</h1>

      <input type="file" accept=".csv" onChange={handleFileUpload} />

      {columns.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold">Filters</h2>
          <div className="grid grid-cols-3 gap-2">
            {columns.map((col) => (
              <input
                key={col}
                placeholder={`Filter ${col}`}
                value={filters[col] || ""}
                onChange={(e) => handleFilterChange(col, e.target.value)}
                className="border p-2 rounded"
              />
            ))}
          </div>
        </div>
      )}

      {filteredData.length > 0 && (
        <div className="overflow-auto mt-6">
          <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col} className="border p-2 bg-gray-200">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td key={col} className="border p-2">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
