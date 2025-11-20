'use client'
import React, { useState } from 'react';
import { TrashIcon, WarningIcon, PenIcon} from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import Header from '@ds/shared/Header';

// const MOCK_DATA = [
const MOCK_DATA = [
  {id: 1, name: "andi",
    pets: [
      { petId: 101, species: "Kucing",date: '01/01/2025', petName: "guguk", keluhan:'diare' },
      { petId: 102, species: "Anjing", date: '01/01/2025', petName: 'rakai' },
      { petId: 107, species: "Ikan", date: '01/01/2025' } ],
    },
    {id: 2, name: "budi",
    pets: [
      { petId: 104, species: "Kucing", date: '01/01/2025' }, 
      { petId: 105, species: "Anjing",date: '01/01/2025' },
      { petId: 103, species: "Ikan", date: '01/01/2024' } ],
    },
    {id: 3, name: "cinta",
    pets: [
      { petId: 106, species: "Kucing", date: '01/01/2012' }, 
      { petId: 109, species: "Anjing", date: '01/01/2012' },
      ],
  },
  {id: 4, name: "Falah",
    pets: [
      { petId: 201, species: "Kucing", date: '01/01/2012' } ],
  },
];

const flattenReservasiData = (ownerData)=>{
  const flattened =[];
  ownerData.forEach(owner => {
    if(owner.pets && owner.pet.length>0){
      owner.pets.fotEach(pet=>{
        flattened.push({
          id: pet.petId,
          petName: pet.petName || `Hewan ${pet.petId}`, // Fallback jkalau ada petName sama ini jujur aku males ngisinya hehe nanti dihapus aja  kode || dan setelahnya
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
}

const RESERVASI_COLUMNS=[
  {key: 'ownerName', header: 'Nama Pasien'},
  {key:'petName', header:'Hewan'},
  {key: 'date', header: 'Tanggal Reservasi'},
  {key: 'keluhan', header: 'Keluhan'},
  {key: 'status', header: 'Status'},
  {key: 'actions', header: 'Aksi', isAction: true},
]