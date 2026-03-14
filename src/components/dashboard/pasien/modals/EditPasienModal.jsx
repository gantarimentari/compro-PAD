'use client';

import React, { useState, useEffect } from 'react';
import BaseModal from '../../shared-modals/BaseModal';
import Button from '@/components/ui/Button';
import SuccessToast from '@/components/ui/SuccessToast';

const EditPasienModal = ({ isOpen, onClose, pasien, onSave }) => {
  const [formData, setFormData] = useState({
    name:  '',
    phoneNumber:'',
    email: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [emailError, setEmailError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pasien) {
      setFormData({
        name: pasien.name  || '',
        phoneNumber: pasien.phoneNumber || '',
        email: pasien.email || '',
      });
      setEmailError('');
      setShowSuccess(false);
    }
  }, [pasien, isOpen]);

  if (!isOpen || !pasien) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setIsSubmitting(true);

    try {
      // nunggu proses update di be selesai
      await onSave(pasien.id, formData);
      setShowSuccess(true);
      // sukses, show success toast, lalu tutup modal setelah delay
      setTimeout(() => { setShowSuccess(false); onClose(); }, 1500);
    } catch (error){
        console.error('❌ Validation error updating patient:', {
          status: error?.response?.status,
          data: error?.response?.data,
          message: error?.message
        });

        const backendErrors = error?.response?.data?.errors;
        const emailValidationMessage = backendErrors?.email?.[0];
        const backendMessage = error?.response?.data?.message;
        const fallbackMessage = error?.message;

        // Prioritize field-level Laravel validation error for duplicate email.
        const resolvedMessage =
          emailValidationMessage ||
          backendMessage ||
          fallbackMessage ||
          'Gagal memperbarui pasien.';

        if(resolvedMessage.toLowerCase().includes('email')) {
          setEmailError('Email sudah terdaftar, gunakan email lain');
        } else {
          setEmailError(resolvedMessage);
        }
        
    } finally {
          setIsSubmitting(false);
        }
    
    
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Pasien"
      description="Perbarui data pasien"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2  space-y-2">
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

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
          >
            Batal
          </button>
          <Button
            type="submit"
            disabled={isSubmitting}
            color="bg-accent-blue-400" 
            hoverColor="hover:bg-accent-blue-500"
            focusColor="focus:bg-accent-blue-300"
            roundedClass="rounded-lg"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
      <SuccessToast show={showSuccess} />
    </BaseModal>
  );
};

export default EditPasienModal;
