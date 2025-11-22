'use client';

import React, { useState } from 'react';
import { TrashIcon, PenIcon, WarningIcon} from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import { TambahAdminModal, DeleteConfirmModal, EditAdminModal } from '@ds/dashboard/modals';


const MOCK_DATA=[
  {id: 1, adminName: "andi", userName: "02123456789", email: "andi@gmail.com", date:  '01/01/2025'},
  {id: 2, adminName: "budi", userName: "ok", email: "ani@gmail.com", date:  '01/01/2025'},
  {id: 3, adminName: "rakai", userName: "rakai", email: "ndi@gmail.com", date:  '01/01/2025'}
]
const ADMIN_COLUMNS =[
  {key: 'adminName', header:'Nama Admin'},
  {key:'userName', header:'Username'},
  {key: 'email', header:'Email'},
  {key:'date', header:'Tanggal Dibuat'},
  { key: 'actions', header: 'Aksi', isAction: true },
]
const renderCell =(item, key,onEdit, onDelete)=>{
  switch(key){
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
              label={`Edit ${item.admin}`}
            />
           <Button 
              icon={<TrashIcon className="h-4 w-4" />} 
              roundedClass="rounded-lg"
              color="bg-accent-red-300" 
              hoverColor="hover:bg-accent-red-400"
              onClick={() => onDelete(item)}
              label={`Hapus ${item.admin}`}
            />
        </div>
      );
    default:
        return item[key]; 
  }
};
export default function ManagemenAdmin(){
  const [adminData, setAdminData] = useState(MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const filteredData = adminData.filter(item=>
    item.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) 
  );
  const handleSaveAdmin= (formData)=>{
    const newAdmin= {
      id: Math.max(...adminData.map(item => item.id), 0) + 1,
      adminName: formData.adminName,
      userName: formData.userName,
      email: formData.email,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    };
    setAdminData([...adminData, newAdmin]);
    setIsModalOpen(false);
  };
  const handleEditAdmin   =(id,formData)=>{
    setAdminData(adminData.map(item=>
      item.id=== id?{
      ...item,
      adminName: formData.adminName,
      userName: formData.userName,
      email: formData.email,
      // Hanya update password jika diisi (opsional)
      ...(formData.password && { password: formData.password })
      } : item
    ));
    setIsEditModalOpen(false);
    setSelectedAdmin(null);
  };
  
  const handleDelete =(item)=>{
    setAdminToDelete(item);
    setIsDeleteModalOpen(true);
  };
  const handleConfirmDelete = () => {
    setAdminData(adminData.filter(item => item.id !== adminToDelete.id));
    setIsDeleteModalOpen(false);
    setAdminToDelete(null);
  };
  const handleEdit = (item) => {
    setSelectedAdmin(item);
    setIsEditModalOpen(true);
  };

  return(
    <div className="space-y-6">
      <PageHeader 
        title="Managemen Admin"
        description="Kelola akun administrator sistem"
        addButtonText="Tambah Admin"
        onAddClick={() => setIsModalOpen(true)}
      />
      <div className='space-y-4'>
      <SearchBar
          placeholderText="Cari nama, usernamse, atau email..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Table 
          columns={ADMIN_COLUMNS}
          data={filteredData}
          renderCell={(item, key) => renderCell(item, key, handleEdit, handleDelete)}
        />
      </div>
      <TambahAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAdmin}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAdminToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={adminToDelete?.adminName}
        itemType="admin"
      />
      <EditAdminModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAdmin(null);
        }}
        admin={selectedAdmin}
        onSave={handleEditAdmin}
      />

    </div>
  )


  
} 

