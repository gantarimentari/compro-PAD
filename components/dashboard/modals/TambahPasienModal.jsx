'use client';

import React, { useState } from 'react';
import BaseModal from './BaseModal';

const TambahPasienModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password minimal 8 karakter';
    }
    
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi password
    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return; // Jangan tutup modal dan jangan simpan data
    }

    // Jika validasi berhasil, lanjutkan simpan
    setPasswordError('');
    setEmailError('');
    
    try {
      await onSave(formData);
      // Kalau berhasil, reset form dan tutup modal
      setFormData({
        name: '',
        phoneNumber: '',
        email: '',
        password: ''
      });
      onClose();
    } catch (error) {
      // Tangkap error dan tampilkan di field yang sesuai
      const errorMessage = error.message || 'Terjadi kesalahan';
      if (errorMessage.toLowerCase().includes('email')) {
        setEmailError('Email sudah terdaftar, gunakan email lain');
      } else {
        setEmailError(errorMessage);
      }
      // Modal tidak ditutup, user bisa perbaiki data
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Pasien Baru"
      description="Masukkan data pasien baru untuk mendaftar ke sistem"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-2">
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Nama Lengkap
          </label>
          <input 
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Masukkan nama lengkap"
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2 placeholder:text-accent-neutral-800"
            required              
          />
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Nomor HP
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="081234567890"   
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2 placeholder:text-accent-neutral-800"
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
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (emailError) setEmailError(''); // Clear error saat user mengetik
            }}
            placeholder="email@example.com"
            className={`w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition duration-150 text-body-2 placeholder:text-accent-neutral-800 ${
              emailError ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
            required 
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {emailError}
            </p>
          )}
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Password
          </label>
          <input  
            type="password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (passwordError) setPasswordError(''); // Clear error saat user mengetik
            }}
            
            placeholder="Masukkan password"
            className={`w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition duration-150 text-body-2 placeholder:text-accent-neutral-800 ${
              passwordError ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
            required 
          />
          {passwordError && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {passwordError}
            </p>
          )}
          
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
            Simpan
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default TambahPasienModal;

