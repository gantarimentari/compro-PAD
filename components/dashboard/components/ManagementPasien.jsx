'use client';

import React, { useState } from 'react';
import { TrashIcon, WarningIcon, PenIcon} from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import {TambahPasienModal,EditPasienModal,PreviewPasienModal,DeleteConfirmModal,} from '@ds/dashboard/modals';

const MOCK_DATA =[
  {id: 1, name: "andi", phoneNumber: "02123456789", email: "andi@gmail.com", date:  '01/01/2025', 
    pets: [
      { petName: "Luna", species: "Kucing" },
      { petName: "Rocky", species: "Anjing"},
      { petName: "Nemo", species: "Ikan" } ],
    },
    {id: 2, name: "budi", phoneNumber: "02123456789", email: "budi@gmail.com", date:  '01/01/2025', 
    pets: [
      { petName: "Luna", species: "Kucing" },
      { petName: "Rocky", species: "Anjing"},
      { petName: "Nemo", species: "Ikan" } ],
    },
    {id: 3, name: "cinta", phoneNumber: "02123456789", email: "cinta@gmail.com", date:  '01/01/2025', 
    pets: [
      { petName: "Luna", species: "Kucing" },
      { petName: "Rocky", species: "Anjing"},
      { petName: "Nemo", species: "Ikan" } ],
}];

// buat kolom table
const PATIENT_COLUMNS = [
  { key: 'name', header: 'Nama Pasien' },
  { key: 'phoneNumber', header: 'Nomor HP' },
  { key: 'email', header: 'Email' },
  { key: 'date', header: 'Tanggal Dibuat' },
  { key: 'actions', header: 'Aksi', isAction: true },
];

export default function ManagementPasien(){
  const [pasienData, setPasienData] = useState(MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPasien, setSelectedPasien] = useState(null);
  const [pasienToDelete, setPasienToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  //filter 
  const filteredData = pasienData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSavePasien = (formData) => {
    const newPasien = {
      id: pasienData.length + 1,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      pets: []
    };
    setPasienData([...pasienData, newPasien]);
  };

  const handleEditPasien = (id, formData) => {
    setPasienData(pasienData.map(item =>
      item.id === id ? { 
        ...item, 
        ...formData 
      } : item
    ));
    setIsEditModalOpen(false);
    setSelectedPasien(null);
  };

  const handleDelete = (id) => {
    const pasien = pasienData.find(item => item.id === id);
    setPasienToDelete(pasien);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setPasienData(pasienData.filter(item => item.id !== pasienToDelete.id));
    setIsDeleteModalOpen(false);
    setPasienToDelete(null);
  };

  const handlePreview = (item) => {
    setSelectedPasien(item);
    setIsPreviewModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedPasien(item);
    setIsEditModalOpen(true);
  };


  const renderCell = (item, key) => {
    switch (key) {
      case 'actions':
        return (
          <div className="flex justify-center space-x-2">
            <Button 
              icon={<PenIcon className="h-4 w-4" />} 
              roundedClass="rounded-lg"
              color="bg-accent-yellow-300" 
              hoverColor="hover:bg-accent-yellow-500"
              focusColor="focus:bg-accent-yellow-400"
              onClick={() => handleEdit(item)}
              label={`Edit ${item.name}`}
            />
            <Button 
              icon={<TrashIcon className="h-4 w-4" />} 
              roundedClass="rounded-lg"
              color="bg-accent-red-300" 
              hoverColor="hover:bg-accent-red-400"
              onClick={() => handleDelete(item.id)}
              label={`Hapus ${item.name}`}
            />
            <Button 
              icon={<WarningIcon className="h-4 w-4" />} 
              roundedClass="rounded-lg"
              color="bg-accent-blue-400" 
              hoverColor="hover:bg-accent-blue-500"
              focusColor="focus:bg-accent-blue-300"
              onClick={() => handlePreview(item)}
              label={`Preview ${item.name}`}
            />
          </div>
        );
      default:
        return item[key];
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manajemen Pasien"
        description="Kelola data pasien klinik hewan"
        addButtonText="Tambah Pasien"
        onAddClick={() => {
          console.log('Tombol Tambah Pasien diklik');
          setIsModalOpen(true);
        }}
      />
 
      <div className="space-y-4">
        <SearchBar
          placeholderText="Cari nama, email, atau nomor HP..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Table 
          columns={PATIENT_COLUMNS}
          data={filteredData}
          renderCell={renderCell}
        />
      </div>

      <TambahPasienModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePasien}
      />

      <EditPasienModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPasien(null);
        }}
        pasien={selectedPasien}
        onSave={handleEditPasien}
      />

      <PreviewPasienModal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setSelectedPasien(null);
        }}
        pasien={selectedPasien}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPasienToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName={pasienToDelete?.name}
        itemType="pasien"
      />
    </div>
  );
}
