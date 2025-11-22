'use client';

import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';

const EditAdminModal = ({ isOpen, onClose, onSave, admin }) => {
  const [formData, setFormData] = useState({
    adminName: '',
    userName: '',
    email: '',
    password: '',
  });
  
  useEffect(() => {
    if (admin) {
      setFormData({
        adminName: admin.adminName || '',
        userName: admin.userName || '',
        email: admin.email || '',
        password: '', // Reset password saat edit (opsional)
      });
    } else {
      // Reset form ketika admin null
      setFormData({
        adminName: '',
        userName: '',
        email: '',
        password: '',
      });
    }
  }, [admin, isOpen]);
  
  if (!isOpen || !admin) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(admin.id, formData);
    onClose();
  };
  return (
    <BaseModal
    isOpen={isOpen}
    onClose={onClose}
    title="Edit Admin"
    description="Perbarui data administrator"
    maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-2">
      <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Nama Admin
          </label>
          <input 
            type="text"
            value={formData.adminName}
            onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
            placeholder="Masukkan nama admin"
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required              
          />
        </div>
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Username
          </label>
          <input 
            type="text"
            value={formData.userName}
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            placeholder="Masukkan username"
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required              
          />
        </div>
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Email
          </label>
          <input 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@example.com"
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required              
          />
        </div>
        <div>
        <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Password Baru(Opsional)
          </label>
          <input  
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Kosongkan jika tidak ingin mengubah password"
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          
          />
        </div>
        <div className="flex justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </BaseModal>
  )
};

export default  EditAdminModal;