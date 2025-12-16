'use client';

import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { UploadIcon } from '@ds/icons';

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
      setFormData({ ...formData, file });
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
            className="text-body-2  w-full px-4 py-2 border bg-accent-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 placeholder:text-accent-neutral-800"
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
            className="w-full px-4 py-2 text-body-2 text-accent-neutral-800 border bg-accent-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none "
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
          <textarea
            value={formData.isiArtikel}
            onChange={(e) => setFormData({ ...formData, isiArtikel: e.target.value })}
            placeholder="Tulis konten artikel disini..."
            rows={6}
            className="text-body-2 w-full px-4 py-2 border bg-accent-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none placeholder:text-accent-neutral-800"
            required
          />
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-2">
            Upload Media (Gambar)
          </label>
          <div className="relative">
            <div className="relative border-2 bg-accent-neutral-200 rounded-lg p-2 cursor-pointer transition duration-150 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500">
              <div className="relative z-10 flex items-center justify-between">
                <p className={`text-sm ${formData.file ? 'text-accent-neutral-1000 font-medium' : 'text-accent-neutral-800'} truncate pr-2`}>
                  {formData.file ? formData.file.name : 'Upload media anda disini'}
                </p>
                <UploadIcon className="w-5 h-5 flex-shrink-0" />
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
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="text-body-2 w-full px-4 font-bold py-2 border bg-accent-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none "
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

