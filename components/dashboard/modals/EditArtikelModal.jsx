'use client';

import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { UploadIcon } from '@ds/icons';
import QuillEditor from '@ds/shared/QuillEditor';

const EditArtikelModal = ({ isOpen, onClose, onSave, article }) => {
  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    isiArtikel: '',
    file: null,
    status: 'Draft'
  });

  useEffect(() => {
    if (article) {
      setFormData({
        judul: article.title || '',
        kategori: article.category || '',
        isiArtikel: article.content || '',
        file: null,
        status: article.status || 'Draft'
      });
    }
  }, [article]);

  if (!isOpen || !article) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(article.id, formData);
    onClose();
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
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Judul
          </label>
          <input
            type="text"
            value={formData.judul}
            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
            placeholder="Masukkan judul artikel"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select
            value={formData.kategori}
            onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none bg-white"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Isi Artikel
          </label>
          <QuillEditor
            value={formData.isiArtikel}
            onChange={(html) => setFormData(prev => ({ ...prev, isiArtikel: html }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Media (Gambar)
          </label>
          <div className="relative">
            <div className="relative border-2 border-gray-300 rounded-lg p-8 text-center transition duration-150">
              <div className="relative z-10">
                <div className="flex justify-center mb-2">
                  <UploadIcon className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">Upload media anda disini</p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none bg-white"
          >
            <option value="Draft">Draft</option>
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 font-medium shadow-sm"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditArtikelModal;


