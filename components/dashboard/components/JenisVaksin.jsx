'use client';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import { TambahJenisVaksinModal } from '@ds/dashboard/modals';

const JENIS_VAKSIN_COLUMNS = [
  { key: 'type', header: 'Jenis Vaksin' },
  { key:'interval', header: 'Interval Booster' },
  { key: 'sideEffect', header: 'Efek Samping'},
  { key: 'status', header: 'Status' },
  { key: 'actions', header: 'Aksi', isAction: true },
];

export default function JenisVaksin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: jenisVaksinData = [], isLoading } = useQuery({
    queryKey: ['jenis-vaksin'],
    queryFn: () => [], // Ganti dengan fungsi fetch data jenis vaksin dari API
    staleTime: 5 * 60 * 1000,
  });

  const filteredData = jenisVaksinData.filter((item) =>
    [item.type, item.interval, item.sideEffect, item.status]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderCell = (item, key) => {
    if (key === 'actions') {
      return '-';
    }

    return item[key] || '-';
  };
  
  return (
    <div className="space-y-6">
      <PageHeader title='Jenis Vaksin' description='Kelola daftar jenis vaksin dan interval booster' addButtonText='Tambah Jenis Vaksin' onAddClick={() => setIsModalOpen(true)} />
        <div className='space-y-4'>
          <SearchBar placeholderText='Cari nama vaksin atau deskripsi...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {isLoading ? (
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : (
          <Table columns={JENIS_VAKSIN_COLUMNS} data={filteredData} renderCell={renderCell} />
        )}
        </div>
        <TambahJenisVaksinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
        // onSave={handleSaveSpecies} 
          />
    </div>
  );

}