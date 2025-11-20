'use client'
import React, { useState, useRef, useEffect, } from 'react';
import { TrashIcon, WarningIcon, PenIcon, ChevronDownIcon} from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import Header from '@ds/shared/Header';
import { TambahReservasiModal,DeleteConfirmModal, EditReservasiModal } from '@ds/dashboard/modals';

// const MOCK_DATA = [
const MOCK_DATA = [
  {id: 1, name: "andi",
    pets: [
      { petId: 101, species: "Kucing",date: '01/01/2025', petName: "guguk", keluhan:'diare', status: 'pending' },
      { petId: 102, species: "Anjing", date: '01/01/2025', petName: 'rakai', status: 'belum' },
      { petId: 107, species: "Ikan", date: '01/01/2025',petName: 'falah', status: 'selesai' } ],
    },
    {id: 2, name: "budi",
    pets: [
      { petId: 104, species: "Kucing", date: '01/01/2025', petName: 'rakai', status: 'pending' }, 
      { petId: 105, species: "Anjing",date: '01/01/2025', petName: 'rakai', status: 'batal' },
      { petId: 103, species: "Ikan", date: '01/01/2024', petName: 'rakai', status: 'selesai' } ],
    },
    {id: 3, name: "cinta",
    pets: [
      { petId: 106, species: "Kucing", date: '01/01/2012',petName: 'rakai', status: 'belum' }, 
      { petId: 109, species: "Anjing", date: '01/01/2012', petName: 'rakai', status: 'pending' },
      ],
  },
  {id: 4, name: "Falah",
    pets: [
      { petId: 201, species: "Kucing", date: '01/01/2012', petName: 'rakai', status: 'selesai' } ],
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
          status: pet.status || 'pending',
          ownerName: owner.name,
          ownerId: owner.id
        });
      });
    }
    
  });
  return flattened;
};

// Status Dropdown Component
const StatusDropdown = ({ currentStatus, onStatusChange, itemId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'belum', label: 'Belum' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'batal', label: 'Batal' },
  ];

  const currentStatusOption = statusOptions.find(option => option.value === currentStatus) || statusOptions[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleStatusSelect = (status) => {
    onStatusChange(itemId, status);
    setIsOpen(false);
  };
  

  return (
    <div className="relative" ref={buttonRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 hover:shadow-md whitespace-nowrap bg-gray-100 text-gray-800"
      >
        <span>{currentStatusOption.label}</span>
        <ChevronDownIcon 
          className={`w-4 h-4 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          color="currentColor"
        />
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 z-[9999] w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 flex flex-col"
        >
          {statusOptions.map((option) => {
            const isSelected = option.value === currentStatus;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleStatusSelect(option.value)}
                className={`
                  w-full text-left px-3 py-2 text-sm transition-colors text-gray-800
                  ${isSelected 
                    ? 'bg-gray-100 font-medium' 
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
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
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [reservasiToDelete, setReservasiToDelete] = useState(null);
   const [selectedReservasi, setSelectedReservasi] = useState(null);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   // filter / search
   const flattenedData = flattenReservasiData(ReservasiData);
   const filteredData = flattenedData.filter(item=>
    (item.petName?.toLowerCase()).includes(searchQuery.toLowerCase()) || 
    (item.ownerName?.toLowerCase()).includes(searchQuery.toLowerCase()) ||
    (item.species?.toLowerCase()).includes(searchQuery.toLowerCase()) ||
    (item.date?.toLowerCase()).includes(searchQuery.toLowerCase()) ||
    (item.keluhan?.toLowerCase()).includes(searchQuery.toLowerCase()) ||
    (item.status?.toLowerCase() || '').includes(searchQuery.toLowerCase())
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
        status: 'pending',
      };
      setReservasiData(ReservasiData.map(o => 
        o.id === owner.id 
          ? { ...o, pets: [...(o.pets || []), newPet] }
          : o
      ));
    }
   }

   const handleStatusChange = (petId, newStatus) => {
     setReservasiData(ReservasiData.map(owner => ({
       ...owner,
       pets: owner.pets?.map(pet => 
         pet.petId === petId ? { ...pet, status: newStatus } : pet
       ) || []
     })));
   };

   const handleEdit = (item) => {
     setSelectedReservasi(item);
     setIsEditModalOpen(true);
   };

   const handleEditReservasi = (id, formData) => {
     setReservasiData(ReservasiData.map(owner => {
       if (owner.pets && owner.pets.some(pet => pet.petId === id)) {
         return {
           ...owner,
           pets: owner.pets.map(pet => 
             pet.petId === id 
               ? { 
                   ...pet, 
                   petName: formData.petName, 
                   species: formData.species,
                   date: formData.date,
                   keluhan: formData.keluhan
                 }
               : pet
           )
         };
       }
       return owner;
     }));
     setIsEditModalOpen(false);
     setSelectedReservasi(null);
   };

   const handleDelete = (itemId) => {
    // Cari reservasi dari flattened data (itemId adalah petId)
    const reservasi = flattenedData.find(item => item.id === itemId);
    if (reservasi) {
      setReservasiToDelete(reservasi);
      setIsDeleteModalOpen(true);
    }
   };

   const confirmDelete = () => {
    if (reservasiToDelete) {
      // Hapus pet dari owner yang sesuai
      setReservasiData(prevData => 
        prevData.map(owner => {
          if (owner.id === reservasiToDelete.ownerId) {
            return {
              ...owner,
              pets: owner.pets?.filter(pet => pet.petId !== reservasiToDelete.id) || []
            };
          }
          return owner;
        })
      );
      setIsDeleteModalOpen(false);
      setReservasiToDelete(null);
    }
   };

   const renderCell= (item, key)=>{
    switch (key) {
      case 'status':
        return (
          <StatusDropdown
            currentStatus={item.status || 'pending'}
            onStatusChange={handleStatusChange}
            itemId={item.id}
          />
        );
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
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setReservasiToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName={reservasiToDelete?.petName}
        itemType="reservasi"
      />
      <EditReservasiModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedReservasi(null);
        }}
        reservasi={selectedReservasi}
        onSave={handleEditReservasi}
        ownerData={ReservasiData}
      />
      
    </div>
   )
}