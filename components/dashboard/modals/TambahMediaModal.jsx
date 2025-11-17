'use client';

import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { UploadIcon } from '@ds/icons';

const TambahMediaModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    kategori: 'Video',
    linkYoutube: '',
    file: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      kategori: 'Video',
      linkYoutube: '',
      file: null
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
      title="Tambah Media"
      description="Buat media baru untuk klinik anda"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {formData.kategori === 'Foto' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Media
            </label>
            <div className="relative">
              <div className="relative border-2 border-gray-300 rounded-lg p-8 text-center transition duration-150">
                <div className="relative z-10">
                  <div className="flex justify-center">
                    <UploadIcon className="w-5 h-5" />
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
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kategori Media
          </label>
          <select
            value={formData.kategori}
            onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none bg-white"
          >
            <option value="Foto">Foto</option>
            <option value="Video">Video</option>
          </select>
        </div>

        {formData.kategori === 'Video' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Link Youtube Video
            </label>
            <input
              type="url"
              value={formData.linkYoutube}
              onChange={(e) => setFormData({ ...formData, linkYoutube: e.target.value })}
              placeholder="https://youtube.com/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 font-medium shadow-sm"
          >
            Simpan
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default TambahMediaModal;

