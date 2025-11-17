'use client';
import React, { useState, useMemo } from 'react';
import Button from '@ds/Button';
import { TrashIcon, PenIcon} from '@ds/icons';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import {TambahJenisHewanModal, EditJenisHewanModal,DeleteConfirmModal} from '@ds/dashboard/modals';
// import { headers } from 'next/headers';


const MOCK_DATA = [
  {id: 1, name: "andi",
    pets: [
      { petId: 101, species: "Kucing" },
      { petId: 102, species: "Anjing" },
      { petId: 107, species: "Ikan" } ],
    },
    {id: 2, name: "budi",
    pets: [
      { petId: 104, species: "Kucing" }, 
      { petId: 105, species: "Anjing" },
      { petId: 103, species: "Ikan" } ],
    },
    {id: 3, name: "cinta",
    pets: [
      { petId: 106, species: "Kucing" }, 
      { petId: 109, species: "Anjing" },
      { petId: 10, species: "Ikan" } ],
}];

const Species_COLUMNS = [
  {key: 'species', header: 'Jenis Hewan'},
  {key: 'name', header: 'Nama Pemilik'},
  { key: 'actions', header: 'Aksi', isAction: true },
  
];
const flattenPets = (data) => {
  return data.flatMap(owner => 
      owner.pets?.map(pet => ({
          id: `${owner.id}-${pet.petId}`, // Kombinasi ownerId dan petId untuk key unik
          petId: pet.petId,          
          species: pet.species,   
          name: owner.name,        
          ownerId: owner.id,       
          
      })) || []
  );
};
const renderCell = (item,key, onEdit, onDelete) => {
  switch(key){
    case 'actions':
      return(
        <div className="flex justify-center space-x-2">
          <Button 
            icon={<PenIcon className="h-4 w-4" />} 
            roundedClass="rounded-lg"
            color="bg-accent-yellow-300" 
            hoverColor="hover:bg-accent-yellow-500"
            focusColor="focus:bg-accent-yellow-400"
            onClick={() => onEdit(item)}
            label={`Edit ${item.species}`}
          />
         <Button 
            icon={<TrashIcon className="h-4 w-4" />} 
            roundedClass="rounded-lg"
            color="bg-accent-red-300" 
            hoverColor="hover:bg-accent-red-400"
            onClick={() => onDelete(item)}
            label={`Hapus ${item.species}`}
          />
      </div>
      );
    default:
      return item[key];
  }
}

export default function JenisHewan() {
  const [ownerData, setOwnerData] = useState(MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);

  const flattenedSpecies = useMemo(() => flattenPets(ownerData), [ownerData]);
  const filteredData = flattenedSpecies.filter(item =>
    item.species.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveSpecies = (formData) => {
    // Cari owner berdasarkan nama
    const existingOwnerIndex = ownerData.findIndex(owner => owner.name === formData.ownerName);
    
    if (existingOwnerIndex !== -1) {
      // Jika owner sudah ada, tambahkan pet baru ke array pets
      const existingPets = ownerData[existingOwnerIndex].pets || [];
      const newPetId = existingPets.length > 0 
        ? Math.max(...existingPets.map(p => p.petId), 0) + 1 
        : 1;
      const updatedOwnerData = [...ownerData];
      updatedOwnerData[existingOwnerIndex] = {
        ...updatedOwnerData[existingOwnerIndex],
        pets: [
          ...existingPets,
          { petId: newPetId, species: formData.species }
        ]
      };
      setOwnerData(updatedOwnerData);
    } else {
      // Jika owner belum ada, buat owner baru dengan pet
      const newOwnerId = ownerData.length > 0 
        ? Math.max(...ownerData.map(o => o.id), 0) + 1 
        : 1;
      const newOwner = {
        id: newOwnerId,
        name: formData.ownerName,
        pets: [{ petId: 1, species: formData.species }]
      };
      setOwnerData([...ownerData, newOwner]);
    }
  };

  const handleEdit = (item) => {
    setSelectedPet(item);
    setIsEditModalOpen(true);
  };

  const handleUpdateSpecies = (id, formData) => {
    // Parse id yang berbentuk "ownerId-petId"
    const [ownerId, petId] = id.split('-').map(Number);
    
    // Cari owner berdasarkan ownerId
    const ownerIndex = ownerData.findIndex(owner => owner.id === ownerId);
    
    if (ownerIndex !== -1) {
      const updatedOwnerData = [...ownerData];
      const petIndex = updatedOwnerData[ownerIndex].pets.findIndex(p => p.petId === petId);
      
      if (petIndex !== -1) {
        // Update species pet
        updatedOwnerData[ownerIndex].pets[petIndex].species = formData.species;
        
        // Jika owner name berubah, update owner name
        if (formData.ownerName !== updatedOwnerData[ownerIndex].name) {
          // Cari apakah owner dengan nama baru sudah ada
          const existingOwnerIndex = ownerData.findIndex(owner => owner.name === formData.ownerName);
          
          if (existingOwnerIndex !== -1) {
            // Pindahkan pet ke owner yang sudah ada
            const petToMove = updatedOwnerData[ownerIndex].pets[petIndex];
            updatedOwnerData[existingOwnerIndex].pets.push(petToMove);
            // Hapus pet dari owner lama
            updatedOwnerData[ownerIndex].pets.splice(petIndex, 1);
          } else {
            // Update nama owner
            updatedOwnerData[ownerIndex].name = formData.ownerName;
          }
        }
        
        setOwnerData(updatedOwnerData);
      }
    }
    
    setIsEditModalOpen(false);
    setSelectedPet(null);
  };

  const handleDelete = (item) => {
    setPetToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (petToDelete) {

      const [ownerId, petId] = petToDelete.id.split('-').map(Number);
      const ownerIndex = ownerData.findIndex(owner => owner.id === ownerId);
      
      if (ownerIndex !== -1) {
        const updatedOwnerData = [...ownerData];
        updatedOwnerData[ownerIndex].pets = updatedOwnerData[ownerIndex].pets.filter(
          pet => pet.petId !== petId
        );
        
        setOwnerData(updatedOwnerData);
      }
      
      setIsDeleteModalOpen(false);
      setPetToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Jenis Hewan"
        description="Kelola data jenis hewan"
        addButtonText="Tambah Jenis Hewan"
        onAddClick={() => {
          console.log('Tombol Tambah Jenis Hewan diklik');
          setIsModalOpen(true);
        }}
      />
      <div className="space-y-4">
      <SearchBar
          placeholderText="Cari jenis hewan..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      <Table
      columns= {Species_COLUMNS}
      data={filteredData}
      renderCell={(item, key) => renderCell(item, key, handleEdit, handleDelete)}/>  
      </div>
      <TambahJenisHewanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSpecies}
      />
      <EditJenisHewanModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPet(null);
        }}
        onSave={handleUpdateSpecies}
        jenisHewan={selectedPet}
      />
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPetToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={petToDelete?.species || ''}
        itemType="jenis hewan"
      />


    </div>
  )
}