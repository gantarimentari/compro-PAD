'use client';

import React, { useState } from 'react';
import { TrashIcon, PenIcon, WarningIcon} from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import {DeleteConfirmModal, TambahPromoModal, EditPromoModal, PreviewPromoModal} from '@ds/dashboard/modals';

const MOCK_DATA =[
  {id: 1, title: 'Promo 1', description: 'Promo 1 description', startDate: '2025-01-01', endDate: '2025-01-01', status: 'available'},
  {id: 2, title: 'Promo Spesial Awal Tahun', description: 'Diskon awal tahun untuk semua layanan', startDate: '2025-01-05', endDate: '2025-01-15', status: 'available'},
  {id: 3, title: 'Promo Valentine', description: 'Promo khusus Valentine hewan peliharaan', startDate: '2025-02-10', endDate: '2025-02-14', status: 'Available'},
  {id: 4, title: 'Promo Akhir Bulan', description: 'Diskon akhir bulan untuk grooming', startDate: '2025-03-25', endDate: '2025-03-30', status: 'Unavailable'},
  {id: 5, title: 'Promo Lebaran', description: 'Promo spesial menyambut hari raya', startDate: '2025-04-01', endDate: '2025-04-20', status: 'Unavailable'}  
];

const PROMO_COLUMNS = [
  {key: 'title', header: 'Judul Promo'},
  {key: 'startDate', header: 'Tanggal Mulai'},
  {key: 'endDate', header: 'Tanggal Selesai'},
  {key: 'status', header: 'Status Promo'},
  {key: 'actions', header: 'Aksi', isAction: true},
];
const StatusTag = ({ status }) => {
  const color = status === 'Available' ? 'bg-accent-green-50 text-accent-green-450' : 'bg-accent-red-50 text-accent-red-450';
  return (
    <span className={`px-4 py-2 text-body-2 rounded-lg w-24    ${color}`}>
      {status}
    </span>
  );
};

// Render cell function
const renderCell = (item, key, onEdit, onDelete, onPreview) => {
  switch (key) {
    case 'status':
      return <StatusTag status={item.status} />;
    case 'actions':
      return (
        <div className="flex justify-center space-x-2">
          <Button 
            icon={<PenIcon className="h-4 w-4" />} 
            roundedClass="rounded-lg"
            color="bg-accent-yellow-300" 
            hoverColor="hover:bg-accent-yellow-500"
            focusColor="focus:bg-accent-yellow-400"
            onClick={() => onEdit(item)}
            label={`Edit ${item.title}`}
          />
          <Button 
            icon={<TrashIcon className="h-4 w-4" />} 
            roundedClass="rounded-lg"
            color="bg-accent-red-300" 
            hoverColor="hover:bg-accent-red-400"
            onClick={() => onDelete(item)}
            label={`Hapus ${item.title}`}
          />
          <Button 
            icon={<WarningIcon className="h-4 w-4" />} 
            roundedClass="rounded-lg"
            color="bg-accent-blue-400" 
            hoverColor="hover:bg-accent-blue-500"
            focusColor="focus:bg-accent-blue-300"
            onClick={() => onPreview(item)}
            label={`Preview ${item.title}`}
          />
        </div>
      );
    default:
      return item[key];
  }
};

export default function ManagemenPromo() {
  const [promoData, setPromoData] = useState(MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [promoToDelete, setPromoToDelete] = useState(null);

  const filteredData = promoData.filter(item=> 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  ); 

  const handleSavePromo = (formData) => {
    const newPromo = {
      id: promoData.length + 1,
      title: formData.title,
      description: formData.description,
      startDate: new Date(formData.startDate).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      endDate: new Date(formData.endDate).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      status: formData.status
    };
    setPromoData([...promoData, newPromo]);
  };

  const handleDelete = (promo) => {
    setPromoToDelete(promo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (promoToDelete) {
      setPromoData(promoData.filter(item => item.id !== promoToDelete.id));
      setIsDeleteModalOpen(false);
      setPromoToDelete(null);
    }
  };

  const handleEdit = (item) => {
    setSelectedPromo(item);
    setIsEditModalOpen(true);
  };

  const handleEditPromo = (id, formData) => {
    setPromoData(promoData.map(item => 
      item.id === id 
        ? {
            ...item,
            title: formData.title,
            description: formData.description,
            startDate: new Date(formData.startDate).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            endDate: new Date(formData.endDate).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            status: formData.status
          }
        : item
    ));
    setIsEditModalOpen(false);
    setSelectedPromo(null);
  };

  const handlePreview = (item) => {
    setSelectedPromo(item);
    setIsPreviewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
      title= "Managemen Promo"
      description="kelola promo yang anda tawarkan"
      addButtonText="Tambah Promo"
      onAddClick={()=>setIsModalOpen(true)}/>
      <div className="space-y-4">
      <SearchBar
          placeholderText="Cari promo..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Table 
        columns={PROMO_COLUMNS}
        data={filteredData}
        renderCell={(item, key) => renderCell(item, key, handleEdit, handleDelete, handlePreview)}
        />
      </div>
      <TambahPromoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePromo}
      />
      <EditPromoModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPromo(null);
        }}
        promo={selectedPromo}
        onSave={handleEditPromo}
      />
      <PreviewPromoModal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setSelectedPromo(null);
        }}
        promo={selectedPromo}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPromoToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={promoToDelete?.title}
        itemType="promo"
      />
    </div>
    
  )

};

