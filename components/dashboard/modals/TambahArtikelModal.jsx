'use client';

import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { UploadIcon } from '@ds/icons';
import QuillEditor from '@ds/shared/QuillEditor';

const TambahArtikelModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    isiArtikel: '',
    file: null,
    status: 'Draft'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      judul: '',
      kategori: '',
      isiArtikel: '',
      file: null,
      status: 'Draft'
    });
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Artikel"
      description="Buat artikel baru untuk konten edukasi"
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
            onChange={(e) => setFormData(prev => ({ ...prev, judul: e.target.value }))}
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
            onChange={(e) => setFormData(prev => ({ ...prev, kategori: e.target.value }))}
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
          {formData.file && (
            <p className="mt-2 text-sm text-gray-600">
              File terpilih: {formData.file.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
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
            Simpan
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default TambahArtikelModal;

