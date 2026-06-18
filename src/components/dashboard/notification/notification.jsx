"use client";
import { useState,useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import SearchBar from '@/components/shared/ManagementSearch';
import Table from '@/components/shared/Table';
import { NOTIFICATION_COLUMNS } from './notif.constants';
import { tableRenderers } from './_components/TabelCells';
import NotificationDetailModal from './_components/NotificationDetailModal';
import { Pagination } from './_components/Pagination';
import { useNotification } from './_hooks/useNotification';
import { LoadingTable } from '../shared-modals/LoadingStatement';
export default function Notification() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const {data, isLoading, isError}= useNotification(page, debouncedSearch);
  const notifications = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;
  const totalData = data?.meta?.totalItems || 0;

  useEffect(() => {
  const handler = setTimeout(() => {
    // Hanya update kalau beneran berubah
    if (search !== debouncedSearch) {
      setDebouncedSearch(search);
      setPage(1); 
    }
  }, 500);

  return () => clearTimeout(handler);
}, [search, debouncedSearch]);

  if(isError) return <div>Error loading notifications</div>;

  const handleOpenDetail = (item) => {
    setSelectedNotification(item);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedNotification(null);
  };

  const handleResend = (item) => {
    console.log('Resend notification:', item);
  };

  // const handleSearchChange = (event) => {
    
  //   setSearch(event.target.value);
  // };

  const handleSearchChange = (event) => {

    const value = event.target.value;

    if (value.length > 255) {
      alert("Teks pencarian terlalu panjang! Maksimal adalah 255 karakter.");
      return; // Stop eksekusi, jangan masukkan karakter tambahan ke state search
    }

    setSearch(value);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications"
      description="Log dan status pengiriman notifikasi" />
      <div className='space-y-4'>
        <SearchBar
          placeholderText="Cari penerima atau tipe..."
          value={search}
          onChange={handleSearchChange}
        />

        {isLoading ? (
          <LoadingTable/>
        ) : (
          <Table columns={NOTIFICATION_COLUMNS} 
           data={notifications}
           renderCell={tableRenderers({
             onOpenDetail: handleOpenDetail,
             onResend: handleResend,
           })} />
        )}
        </div>

      <NotificationDetailModal
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        notification={selectedNotification}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalData={totalData}
        handlePageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}