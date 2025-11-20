'use client';

import React, { useState } from 'react';
import { TrashIcon, PenIcon} from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import {DeleteConfirmModal} from '@ds/dashboard/modals';

const MOCK_DATA =[
  {id: 1, title: 'Promo 1', description: 'Promo 1 description', startDate: '2025-01-01', endDate: '2025-01-01', status: 'available'},
  {id: 2, title: 'Promo Spesial Awal Tahun', description: 'Diskon awal tahun untuk semua layanan', startDate: '2025-01-05', endDate: '2025-01-15', status: 'available'},
  {id: 3, title: 'Promo Valentine', description: 'Promo khusus Valentine hewan peliharaan', startDate: '2025-02-10', endDate: '2025-02-14', status: 'available'},
  {id: 4, title: 'Promo Akhir Bulan', description: 'Diskon akhir bulan untuk grooming', startDate: '2025-03-25', endDate: '2025-03-30', status: 'expired'},
  {id: 5, title: 'Promo Lebaran', description: 'Promo spesial menyambut hari raya', startDate: '2025-04-01', endDate: '2025-04-20', status: 'upcoming'}  
];

const PROMO_COLUMNS = [
  {key: 'title', header: 'Judul Promo'},
  {key: 'startDate', header: 'Tanggal Mulai'},
  {key: 'endDate', header: 'Tanggal Selesai'},
  {key: 'status', header: 'Status Promo'},
  {key: 'actions', header: 'Aksi', isAction: true},
];

export default function ManagemenPromo() {
  const [promoData, setPromoData] = useState(MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState('');

  
  const filteredData = promoData.filter(item=> 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  ); 
  return (
    <div className="space-y-6">
      <PageHeader 
      title= "Managemen Promo"
      description="kelola promo yang anda tawarkan"
      addButtonText="Tambah Promo"
      onAddClick={()=>setIsModalOpen(true)}/>
    </div>
  )

};

