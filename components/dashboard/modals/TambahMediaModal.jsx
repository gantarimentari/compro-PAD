'use client';

import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { UploadIcon } from '@ds/icons';
import SuccessToast from '@ds/ui/SuccessToast';

const TambahMediaModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    kategori: 'Video',
    linkYoutube: '',
    file: null
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file && !formData.linkYoutube) {
      alert('Harap upload file atau masukkan link YouTube!');
      return;
    }

    //  Validasi: jika kategori Video, harus ada link YouTube
    if (formData.kategori === 'Video' && !formData.linkYoutube) {
      alert('Harap masukkan link YouTube untuk kategori Video!');
      return;
    }
    
    setIsSubmitting(true);
    setShowSuccess(false);
    
    try {
      await onSave(formData);
      
      setFormData({
        kategori: 'Video',
        linkYoutube: '',
        file: null
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving media:', error);
      alert('Gagal menyimpan media: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Media"
      description="Buat media baru untuk klinik anda"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-2">
        {formData.kategori === 'Foto' && (
          <div>
            <label className="block text-h-8 font-bold text-accent-neutral-1000 ">
              Upload Media
            </label>
            <div className="relative">
              <div className="relative border-2 rounded-lg text-center transition duration-150 p-2 hover:border-gray-400 bg-accent-neutral-200 cursor-pointer">
                <div className="relative z-10 flex items-center justify-between">
                  <p className={`text-sm ${formData.file ? 'text-accent-neutral-1000 font-medium' : 'text-gray-600'} truncate pr-2`}>
                    {formData.file ? formData.file.name : 'Upload media anda disini'}
                  </p>
                  <UploadIcon className="w-5 h-5 flex-shrink-0" />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="text-body-2 absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Kategori Media
          </label>
          <select
            value={formData.kategori}
            onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
            className="text-body-2 w-full px-4 py-2 border bg-accent-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none"
          >
            <option value="Foto" >Foto</option>
            <option value="Video">Video</option>
          </select>
        </div>

        {formData.kategori === 'Video' && (
          <div>
            <label className="block text-h-8 font-bold text-accent-neutral-1000 ">
              Link Youtube Video
            </label>
            <input
              type="url"
              value={formData.linkYoutube}
              onChange={(e) => setFormData({ ...formData, linkYoutube: e.target.value })}
              placeholder="https://youtube.com/..."
              className="text-body-2 w-full px-4 py-2 border bg-accent-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 placeholder:text-accent-neutral-800"
            />
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150 font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
      <SuccessToast show={showSuccess} />
    </BaseModal>
  );
};

export default TambahMediaModal;

