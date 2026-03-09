'use client';

import React, { useEffect, useState } from 'react';
import BaseModal from './BaseModal';
import SuccessToast from '@ds/ui/SuccessToast';

const TambahPasienModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowSuccess(false);
    }
  }, [isOpen]);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password minimal 8 karakter';
    }
    
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setShowSuccess(false);
    
    // Validasi password
    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      setIsSubmitting(false);
      return; // Jangan tutup modal dan jangan simpan data
    }

    // Jika validasi berhasil, lanjutkan simpan
    setPasswordError('');
    setEmailError('');
    setIsSubmitting(true);
    
    try {
      await onSave(formData);

      // Kalau berhasil, tampilkan toast dulu baru tutup modal.
      setShowSuccess(true);
      setFormData({
        name: '',
        phoneNumber: '',
        email: '',
        password: ''
      });

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      const backendErrors = error?.response?.data?.errors;
      const emailValidationMessage = backendErrors?.email?.[0];
      const backendMessage = error?.response?.data?.message;
      const fallbackMessage = error?.message;

      // Prioritize field-level Laravel validation error for duplicate email.
      const resolvedMessage =
        emailValidationMessage ||
        backendMessage ||
        fallbackMessage ||
        'Terjadi kesalahan saat menyimpan data pasien';
 
      if (resolvedMessage.toLowerCase().includes('email')) {
        setEmailError('Email sudah terdaftar, gunakan email lain');
      } else {
        setEmailError(resolvedMessage);
      }
      // Modal tidak ditutup, user bisa perbaiki data
    } finally {
      setIsSubmitting(false);
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
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
      <SuccessToast show={showSuccess} />
    </BaseModal>
  );
};

export default TambahPasienModal;

