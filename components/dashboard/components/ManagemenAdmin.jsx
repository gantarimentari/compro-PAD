'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TrashIcon, PenIcon } from '@ds/icons';
import Button from '@ds/ui/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import { TambahAdminModal, DeleteConfirmModal, EditAdminModal } from '@ds/dashboard/modals';
import adminService from '@/lib/services/adminService';

const ADMIN_COLUMNS = [
  { key: 'adminName', header: 'Nama Admin' },
  { key: 'userName', header: 'Username' },
  { key: 'email', header: 'Email' },
  { key: 'date', header: 'Tanggal Dibuat' },
  { key: 'actions', header: 'Aksi', isAction: true },
];

const renderCell = (item, key, onEdit, onDelete) => {
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
            onClick={() => onEdit(item)}
            label={`Edit ${item.adminName}`}
          />
          <Button
            icon={<TrashIcon className="h-4 w-4" />}
            roundedClass="rounded-lg"
            color="bg-accent-red-300"
            hoverColor="hover:bg-accent-red-400"
            onClick={() => onDelete(item)}
            label={`Hapus ${item.adminName}`}
          />
        </div>
      );
    default:
      return item[key];
  }
};

export default function ManagemenAdmin() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const { data: adminData = [], isLoading } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const data = await adminService.getAll();
      return data.map(admin => ({
        id: admin.id,
        adminName: admin.username,
        userName: admin.username,
        email: admin.email,
        date: new Date(admin.created_at).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
      }));
    },
    staleTime: 5 * 60 * 1000,
  });

  const filteredData = adminData.filter(item =>
    item.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveAdmin = async (formData) => {
    try {
      await adminService.create({
        username: formData.userName,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phoneNumber || null,
      });
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      // ❌ JANGAN close modal! Biarkan modal close sendiri setelah toast
      // setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating admin:', err);
      throw err; // Re-throw untuk ditangkap modal;
    }
  };

  const handleEditAdmin = async (id, formData) => {
    try {
      const updateData = {
        username: formData.userName,
        email: formData.email,
        phone_number: formData.phoneNumber || null,
      };
      if (formData.password) updateData.password = formData.password;
      await adminService.update(id, updateData);
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      // ❌ Commented: setIsEditModalOpen(false); setSelectedAdmin(null); - Let modal close after showing toast
      // Modal will close itself after displaying SuccessToast for 1500ms
    } catch (err) {
      console.error('Error updating admin:', err);
      throw err; // Re-throw for modal error handling
    }
  };

  const handleDelete = (item) => {
    setAdminToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await adminService.remove(adminToDelete.id);
      queryClient.invalidateQueries({ queryKey: ['admins'] });
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Managemen Admin"
        description="Kelola akun administrator sistem"
        addButtonText="Tambah Admin"
        onAddClick={() => setIsModalOpen(true)}
      />
      <div className="space-y-4">
        <SearchBar
          placeholderText="Cari nama, username, atau email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <Table
            columns={ADMIN_COLUMNS}
            data={filteredData}
            renderCell={(item, key) => renderCell(item, key, handleEdit, handleDelete)}
          />
        )}
      </div>
      <TambahAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAdmin}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setAdminToDelete(null); }}
        onConfirm={handleConfirmDelete}
        itemName={adminToDelete?.adminName}
        itemType="admin"
      />
      <EditAdminModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedAdmin(null); }}
        admin={selectedAdmin}
        onSave={handleEditAdmin}
      />
    </div>
  );
}
