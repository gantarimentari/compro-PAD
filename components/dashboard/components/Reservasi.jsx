'use client'
import React, { useState } from 'react';
import { TrashIcon, WarningIcon, PenIcon} from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import Header from '@ds/shared/Header';
import { TambahReservasiModal } from '@ds/dashboard/modals';

// const MOCK_DATA = [
const MOCK_DATA = [
  {id: 1, name: "andi",
    pets: [
      { petId: 101, species: "Kucing",date: '01/01/2025', petName: "guguk", keluhan:'diare' },
      { petId: 102, species: "Anjing", date: '01/01/2025', petName: 'rakai' },
      { petId: 107, species: "Ikan", date: '01/01/2025',petName: 'falah' } ],
    },
    {id: 2, name: "budi",
    pets: [
      { petId: 104, species: "Kucing", date: '01/01/2025', petName: 'rakai' }, 
      { petId: 105, species: "Anjing",date: '01/01/2025', petName: 'rakai' },
      { petId: 103, species: "Ikan", date: '01/01/2024', petName: 'rakai' } ],
    },
    {id: 3, name: "cinta",
    pets: [
      { petId: 106, species: "Kucing", date: '01/01/2012',petName: 'rakai' }, 
      { petId: 109, species: "Anjing", date: '01/01/2012', petName: 'rakai' },
      ],
  },
  {id: 4, name: "Falah",
    pets: [
      { petId: 201, species: "Kucing", date: '01/01/2012', petName: 'rakai' } ],
  },
];

const flattenReservasiData = (ownerData)=>{
  const flattened =[];
  ownerData.forEach(owner => {
    if(owner.pets && owner.pets.length > 0){
      owner.pets.forEach(pet=>{
        flattened.push({
          id: pet.petId,
          petName: pet.petName, 
          species: pet.species,
          date: pet.date,
          keluhan: pet.keluhan || 'cek kesehatan bulanan',
          status: pet.status,
          ownerName: owner.name,
          ownerId: owner.id
        });
      });
    }
    
  });
  return flattened;
};

const RESERVASI_COLUMNS=[
  {key: 'ownerName', header: 'Nama Pasien'},
  {key:'petName', header:'Hewan'},
  {key: 'date', header: 'Tanggal Reservasi'},
  {key: 'keluhan', header: 'Keluhan'},
  {key: 'status', header: 'Status'},
  {key: 'actions', header: 'Aksi', isAction: true},
];

export default function Reservasi(){
   const [ReservasiData, setReservasiData]=useState(MOCK_DATA);
   const [searchQuery, setSearchQuery] = useState('');
   const [isModalOpen, setIsModalOpen] = useState(false);
   // filter / search
   const flattenedData = flattenReservasiData(ReservasiData);
   const filteredData = flattenedData.filter(item=>
    (item.petName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
    (item.ownerName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (item.species?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (item.date?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (item.keluhan?.toLowerCase() || '').includes(searchQuery.toLowerCase()) 
    // || // ini belum diimplementasi
    // (item.status?.toLowerCase() || '').includes(searchQuery.toLowerCase())
   );
   const handleSaveReservasi = (formData)=>{
    const owner = ReservasiData.find(o => o.name === formData.ownerName);
    if(owner){
      // untuk cari spesies dari hewan yagn dipilih
      const selectedPet = owner.pets?.find(p => p.petName === formData.petName);
      const maxPetId = Math.max(...ReservasiData.flatMap(o => o.pets?.map(p => p.petId) || [0]), 0);
      const newPet = {
        petId: maxPetId + 1,
        petName: formData.petName,
        species: selectedPet?.species || '',
        date: formData.date,
        keluhan: formData.keluhan,
      };
      setReservasiData(ReservasiData.map(o => 
        o.id === owner.id 
          ? { ...o, pets: [...(o.pets || []), newPet] }
          : o
      ));
    }
   }

   const renderCell= (item, key)=>{
    switch (key) {
      // case 'status':
      //   return (

      //   )
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
              label={`Edit ${item.petName}`}
            />
            <Button 
              icon={<TrashIcon className="h-4 w-4" />} 
              roundedClass="rounded-lg"
              color="bg-accent-red-300" 
              hoverColor="hover:bg-accent-red-400"
              onClick={() => handleDelete(item.id)}
              label={`Hapus ${item.petName}`}
            />
          </div>
        );
      default:
        return item[key] || '-';
    }
   }

   return (
    <div className="space-y-6">
      <PageHeader 
      title= 'Reservasi'
      description= 'Kelola data reservasi'
      addButtonText= 'Tambah Reservasi'
      onAddClick= {() => setIsModalOpen(true)}
      />
      <div className="space-y-4">
        <SearchBar 
        placeholderText="Cari nama hewan, jenis, atau pemilik..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Table
        columns={RESERVASI_COLUMNS}
        data={filteredData}
        renderCell={renderCell} 
        />
      </div>
      <TambahReservasiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReservasi}
        ownerData={MOCK_DATA}
      />
      
    </div>
   )
}