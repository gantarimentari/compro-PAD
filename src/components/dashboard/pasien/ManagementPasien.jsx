'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import patientService from '@/lib/services/patientService';
import hewanService from '@/lib/services/hewanService';
import jenisHewanService from '@/lib/services/jenisHewanService';
import { TrashIcon, WarningIcon, PenIcon} from '@/components/icons';
import Button from '@/components/ui/Button';
import Table from '@/components/shared/Table';
import SearchBar from '@/components/shared/ManagementSearch';
import PageHeader from '@/components/shared/PageHeader';
import {TambahPasienModal,EditPasienModal,PreviewPasienModal,DeleteConfirmModal,} from '@/components/dashboard';



// buat kolom table
const PATIENT_COLUMNS = [
  { key: 'name', header: 'Nama Pasien' },
  { key: 'phoneNumber', header: 'Nomor HP' },
  { key: 'email', header: 'Email' },
  { key: 'date', header: 'Tanggal Dibuat' },
  { key: 'actions', header: 'Aksi', isAction: true },
];

export default function ManagementPasien(){
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPasien, setSelectedPasien] = useState(null);
  const [pasienToDelete, setPasienToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

const { data: pasienData = [], isLoading } = useQuery({
  queryKey: ['patients'], // Ini "kunci" agar data disimpan di memori
  queryFn: async () => {
    const data = await patientService.getAll();
    
    // Logika mapping data kamu tetap sama seperti sebelumnya
    return data.map(item => {
      return {
        id: item.id,
        name: item.username,
        phoneNumber: item.phone_number,
        email: item.email,
        date: new Date(item.created_at).toLocaleDateString('id-ID'),
        pets: item.hewans?.map(hewan => ({
          id: hewan.id_hewan,
          petName: hewan.nama_hewan,
          species: hewan.jenis_hewan?.nama_jenis || '-',
        })) || []
      };
    });
  },
  staleTime: 5 * 60 * 1000, // Data dianggap "segar" selama 5 menit
});
 
// Ambil data Jenis Hewan dengan Cache
const { data: jenisHewanOptions = [] } = useQuery({
  queryKey: ['jenis-hewan'],
  queryFn: async () => {
    const data = await jenisHewanService.getAll();
    return data;
  },
  staleTime: 5 * 60 * 1000,
});


  //filter
  const filteredData = pasienData.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSavePasien = async (formData) => {
    try{
      const pasienPayload ={
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        pets: []
      };

      const created = await patientService.create(pasienPayload);
      const newPasienId = created.id;

      if (formData.pets && formData.pets.length > 0) {
        for (const pet of formData.pets) {
          await hewanService.create({
            id_pasien: newPasienId,
            id_jenisHewan: pet.speciesId,
            nama_hewan: pet.petName,
            tanggal_lahir_hewan: pet.birthDate || null,
            umur: pet.age || null,
          });
        }
      }
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      // Modal close is handled by TambahPasienModal after showing success toast.
    }catch(err){
      console.error('error saving patieng:', err);
      console.error('Error response:', err.response?.data);
      // Keep original axios error so modal can read Laravel validation payload (errors.email, etc).
      throw err;
    }
    // setPasienData([...pasienData, newPasien]);
  };
  const handleEditPasien = async (id, formData) => {
    try{
      const pasienPayload = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
          password: formData.password,
        pets: []
      };

      if (formData.password){
        pasienPayload.password = formData.password;
      }

      await patientService.update(id, pasienPayload);

      const oldPets = selectedPasien.pets || [];
      for (const pet of oldPets) {
        await hewanService.remove(pet.id);
      }

      if (formData.pets && formData.pets.length > 0) {
        for (const pet of formData.pets) {
          await hewanService.create({
            id_pasien: id,
            id_jenisHewan: pet.speciesId,
            nama_hewan: pet.petName,
            tanggal_lahir_hewan: pet.birthDate || null,
            umur: pet.age || null,
          });
        }
      }

      queryClient.invalidateQueries({ queryKey: ['patients'] });
    } catch(err){
      console.error('eror updating patinet:', err);
      // Keep original axios error so EditPasienModal can show field-level validation errors.
      throw err;
    }
  };

  const handleDelete = (id) => {
    const pasien = pasienData.find(item => item.id === id);
    setPasienToDelete(pasien);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await patientService.remove(pasienToDelete.id);

      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setIsDeleteModalOpen(false);
      setPasienToDelete(null);
    } catch (err) {
      console.error('Error deleting patient:', err);
      alert(`Gagal menghapus pasien: ${err.response?.data?.message || err.message}`);
    }
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
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <Table
            columns={PATIENT_COLUMNS}
            data={filteredData}
            renderCell={renderCell}
          />
        )}
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
