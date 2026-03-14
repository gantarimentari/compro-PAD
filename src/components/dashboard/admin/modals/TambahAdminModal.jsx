'use client';

import React, { useState } from 'react';
import BaseModal from '../../shared-modals/BaseModal';
import SuccessToast from '@/components/ui/SuccessToast';

const TambahAdminModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    adminName: '',
    userName: '',
    email: '',
    password: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);
    
    try {
      await onSave(formData);
      
      setFormData({
        adminName: '',
        userName: '',
        email: '',
        password: ''
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving admin:', error);
      alert('Gagal menyimpan admin: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <BaseModal
    isOpen={isOpen}
    onClose={onClose}
    title="Tambah Admin"
    description="Buat akun administrator baru"
    maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-2">
      <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Nama Admin
          </label>
          <input 
            type="text"
            value={formData.adminName}
            onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
            placeholder="Masukkan nama admin"
            className="text-body-2 placeholder:text-accent-neutral-800 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required              
          />
        </div>
        <div>
          <label className="text-body-2 block text-h-8 font-bold text-accent-neutral-1000">
            Username
          </label>
          <input 
            type="text"
            value={formData.userName}
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            placeholder="Masukkan username"
            className="text-body-2 placeholder:text-accent-neutral-800 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
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
            className="text-body-2 placeholder:text-accent-neutral-800 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required              
          />
        </div>
        <div>
        <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Password
          </label>
          <input  
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Masukkan password"
            className="text-body-2 placeholder:text-accent-neutral-800 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required 
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
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
      <SuccessToast show={showSuccess} />
    </BaseModal>
  )
};
export default TambahAdminModal;