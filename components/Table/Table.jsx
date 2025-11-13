"use client";
import React from 'react';   

/**
 *
 * @param {Array} columns - Definisi header kolom: [{ key: 'id', header: 'ID', isAction: false }]
 * @param {Array} data - Data baris tabel
 * @param {function} renderCell - Fungsi untuk merender konten spesifik di dalam sel data (<td>)
 */
export default function GenericTable({ columns, data, renderCell }) {
  
  // Periksa apakah ada data dan kolom
  if (!data || data.length === 0 || !columns || columns.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-6 text-center text-gray-500">
        Tidak ada data yang ditemukan.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* RENDER HEADER SECARA DINAMIS */}
            {columns.map((column, index) => (
              <th 
                key={index} 
                className="px-6 py-3 text-left text-h-8 text-accent-neutral-1000 font-bold tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-gray-200">
          {/* RENDER DATA BARIS */}
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition duration-150">
              {/* RENDER SEL BERDASARKAN DEFINISI KOLOM */}
              {columns.map((column, colIndex) => (
                <td 
                  key={colIndex} 
                  className="px-6 py-4 whitespace-nowrap text-body-2 text-accent-neutral-1000"
                >
                  {/* Panggil fungsi renderCell untuk konten yang spesifik */}
                  {renderCell(item, column.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}