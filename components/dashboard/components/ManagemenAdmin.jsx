'use client';

import React, { useState, useEffect } from 'react';
import { TrashIcon, PenIcon, WarningIcon} from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import { TambahAdminModal, DeleteConfirmModal, EditAdminModal } from '@ds/dashboard/modals';
import api from '@lib/api.js';
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
  const [adminData, setAdminData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch admin data dari backend
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admins');
      
      // Transform data dari backend ke format yang dibutuhkan frontend
      const transformedData = response.data.map(admin => ({
        id: admin.id,
        adminName: admin.username,
        userName: admin.username,
        email: admin.email,
        date: new Date(admin.created_at).toLocaleDateString('id-ID', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        })
      }));
      
      setAdminData(transformedData);
      setError('');
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError('Gagal memuat data admin');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = adminData.filter(item=>
    item.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) 
  );
  const handleSaveAdmin = async (formData) => {
    try {
      const response = await api.post('/api/admins', {
        username: formData.userName,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phoneNumber || null,
      });

      // Refresh data setelah berhasil menambah
      await fetchAdmins();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating admin:', err);
      alert(err.response?.data?.message || 'Gagal menambahkan admin');
    }
  };
  const handleEditAdmin = async (id, formData) => {
    try {
      const updateData = {
        username: formData.userName,
        email: formData.email,
        phone_number: formData.phoneNumber || null,
      };

      // Hanya tambahkan password jika diisi
      if (formData.password) {
        updateData.password = formData.password;
      }

      await api.put(`/api/admins/${id}`, updateData);

      // Refresh data setelah berhasil update
      await fetchAdmins();
      setIsEditModalOpen(false);
      setSelectedAdmin(null);
    } catch (err) {
      console.error('Error updating admin:', err);
      alert(err.response?.data?.message || 'Gagal mengupdate admin');
    }
  };
  
  const handleDelete =(item)=>{
    setAdminToDelete(item);
    setIsDeleteModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/admins/${adminToDelete.id}`);
      
      // Refresh data setelah berhasil delete
      await fetchAdmins();
      setIsDeleteModalOpen(false);
      setAdminToDelete(null);
    } catch (err) {
      console.error('Error deleting admin:', err);
      alert(err.response?.data?.message || 'Gagal menghapus admin');
    }
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

