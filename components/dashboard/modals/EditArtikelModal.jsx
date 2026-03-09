'use client';

import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { UploadIcon } from '@ds/icons';
import QuillEditor from '@ds/shared/QuillEditor';
import SuccessToast from '@ds/ui/SuccessToast';

const EditArtikelModal = ({ isOpen, onClose, onSave, article }) => {
  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    isiArtikel: '',
    file: null,
    existingImage: null,
    status: 'Draft'
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (article) {
      setFormData({
        judul: article.title || '',
        kategori: article.category || '',
        isiArtikel: article.content || '',
        file: null,
        existingImage: article.imageUrl || article.image || article.thumbnail || null,
        status: article.status || 'Draft'
      });
    }
  }, [article]);

  if (!isOpen || !article) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);
    
    try {
      await onSave(article.id, formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Gagal memperbarui artikel: ' + (error.message || 'Unknown error'));
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
      title="Edit Artikel"
      description="Perbarui konten artikel"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-2">
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Judul
          </label>
          <input
            type="text"
            value={formData.judul}
            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
            placeholder="Masukkan judul artikel"
            className="text-body-2 w-full px-4 py-2 border bg-accent-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 placeholder:text-accent-neutral-800"
            required
          />
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Kategori
          </label>
          <select
            value={formData.kategori}
            onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
            className="text-body-2 w-full px-4 py-2 text-accent-neutral-800 border bg-accent-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none"
            required
          >
            <option value="">Pilih kategori</option>
            <option value="Kesehatan">Kesehatan</option>
            <option value="Vaksinasi">Vaksinasi</option>
            <option value="Fun Fact">Fun Fact</option>
            <option value="Nutrisi">Nutrisi</option>
          </select>
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Isi Artikel
          </label>
          <QuillEditor
            value={formData.isiArtikel}
            onChange={(html) =>
              setFormData(prev => ({ ...prev, isiArtikel: html }))
            }
            placeholder="Tulis konten artikel disini..."
            className="w-full rounded-lg border bg-accent-neutral-200 focus-within:ring-2 focus-within:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-2">
            Upload Media (Gambar)
          </label>
          <div className="relative">
            <div className="relative border-2 bg-accent-neutral-200 rounded-lg p-2 hover:border-gray-400 cursor-pointer transition duration-150">
              <div className="relative z-10 flex items-center justify-between">
                <p className={`text-sm ${formData.file || formData.existingImage ? 'text-accent-neutral-1000 font-medium' : 'text-accent-neutral-800'} truncate pr-2`}>
                  {formData.file 
                    ? formData.file.name 
                    : formData.existingImage 
                      ? formData.existingImage.split('/').pop() || 'existing-image.jpg'
                      : 'Upload media anda disini'}
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

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="text-body-2 w-full px-4 font-bold py-2 border bg-accent-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none"
          >
            <option value="Draft" className='bg-accent-neutral-200'>Draft</option>
            <option value="Publish">Publish</option>
          </select>
        </div>

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
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
      <SuccessToast show={showSuccess} />
    </BaseModal>
  );
};

export default EditArtikelModal;


