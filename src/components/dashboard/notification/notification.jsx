"use client";
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import SearchBar from '@/components/shared/ManagementSearch';
import Table from '@/components/shared/Table';
import { NOTIFICATION_COLUMNS } from './notif.constants';
import { tableRenderers } from './_components/TabelCells';
import { NOTIFICATION_DUMMY_DATA } from './notifDummy.data';
import NotificationDetailModal from './_components/NotificationDetailModal';

export default function Notification() {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications"
      description="Log dan status pengiriman notifikasi" />
      <div className='space-y-4'>
        <SearchBar placeholderText="Cari penerima atau tipe..."/>
        <Table columns={NOTIFICATION_COLUMNS} 
         data={NOTIFICATION_DUMMY_DATA} // nanti ganti dengan data dari API
         renderCell={tableRenderers(handleOpenDetail, handleResend)} />
        </div>

      <NotificationDetailModal
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        notification={selectedNotification}
      />
    </div>
  );
}