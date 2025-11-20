'use client';

import React, { useState } from 'react';
import { TrashIcon, PenIcon} from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import {TambahHewanModal,EditHewanModal,DeleteConfirmModal} from '@ds/dashboard/modals';

const MOCK_DATA = [
  {id: 1, name: "andi",
    pets: [
      { petId: 101, species: "Kucing", petName: "guguk" },
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
      ],
  },
  {id: 4, name: "Falah",
    pets: [
      { petId: 201, species: "Kucing" } ],
  },
];



// Fungsi untuk flatten data dari owner dengan pets menjadi array hewan
const flattenHewanData = (ownerData) => {
  const flattened = [];
  ownerData.forEach(owner => {
    if (owner.pets && owner.pets.length > 0) {
      owner.pets.forEach(pet => {
        flattened.push({
          id: pet.petId,
          petName: pet.petName || `Hewan ${pet.petId}`, // Fallback jkalau ada petName
          species: pet.species,
          ownerName: owner.name,
          ownerId: owner.id
        });
      });
    }
  });
  return flattened;
};
const HEWAN_COLUMNS = [
  {key: 'petName', header: 'Nama Hewan'},
  {key: 'species', header: 'Jenis Hewan'},
  {key: 'ownerName', header: 'Pemilik'},
  {key: 'actions', header: 'Aksi', isAction: true},
  ];

export default function ManagementHewan() {
  const [HewanData, setHewanData] = useState(MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHewan, setSelectedHewan] = useState(null);
  const [hewanToDelete, setHewanToDelete] = useState(null);

  // Flatten data untuk ditampilkan di tabel
  const flattenedData = flattenHewanData(HewanData);

  const filteredData = flattenedData.filter(item =>
    item.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.petName.toLowerCase().includes(searchQuery.toLowerCase())
  );  
  const handleSaveHewan = (formData) => {
    // Cari owner yang dipilih
    const owner = HewanData.find(o => o.name === formData.ownerName);
    if (owner) {
      // Generate petId baru
      const maxPetId = Math.max(...HewanData.flatMap(o => o.pets?.map(p => p.petId) || [0]), 0);
      const newPet = {
        petId: maxPetId + 1,
        petName: formData.petName,
        species: formData.species
      };
      
      // Update owner dengan pet baru
      setHewanData(HewanData.map(o => 
        o.id === owner.id 
          ? { ...o, pets: [...(o.pets || []), newPet] }
          : o
      ));
    }
  };

  const handleEditHewan = (id, formData) => {
    // Update pet dalam owner
    setHewanData(HewanData.map(owner => {
      if (owner.pets && owner.pets.some(pet => pet.petId === id)) {
        return {
          ...owner,
          pets: owner.pets.map(pet => 
            pet.petId === id 
              ? { ...pet, petName: formData.petName, species: formData.species }
              : pet
          )
        };
      }
      return owner;
    }));
    setIsEditModalOpen(false);
    setSelectedHewan(null);
  };

  const handleDelete = (id) => {
    // Cari hewan dari flattened data
    const hewan = flattenedData.find(item => item.id === id);
    setHewanToDelete(hewan);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // Hapus pet dari owner
    setHewanData(HewanData.map(owner => ({
      ...owner,
      pets: owner.pets?.filter(pet => pet.petId !== hewanToDelete.id) || []
    })));
    setIsDeleteModalOpen(false);
    setHewanToDelete(null);
  };

  const handleEdit = (item) => {
    setSelectedHewan(item);
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
        title="Manajemen Hewan"
        description="Kelola data hewan"
        addButtonText="Tambah Hewan"
        onAddClick={() => setIsModalOpen(true)}
      />

      <div className="space-y-4">
        <SearchBar
          placeholderText="Cari nama hewan, jenis, atau pemilik..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Table 
          columns={HEWAN_COLUMNS}
          data={filteredData}
          renderCell={renderCell}
        />
      </div>

      <TambahHewanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHewan}
        ownerData={MOCK_DATA}
      />

      <EditHewanModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedHewan(null);
        }}
        hewan={selectedHewan}
        onSave={handleEditHewan}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setHewanToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName={hewanToDelete?.petName}
        itemType="hewan"
      />
    </div>
  )

}