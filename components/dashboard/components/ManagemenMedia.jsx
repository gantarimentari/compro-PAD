'use client';

import React, { useState } from 'react';
import { SearchIcon, CloseIcon, TrashIcon, AddIcon, WarningIcon, UploadIcon} from '@ds/icons';
import Button from '@ds/Button';

// Mock Data
const MOCK_DATA = [
  { id: 1, name: 'img_123', date: '01/01/2025', category: 'Foto', imageUrl: '/images/gambarkucingarticle.png' },
  { id: 2, name: 'img_1234', date: '01/01/2025', category: 'Foto', imageUrl: '/images/hamster.png' },
  { id: 3, name: 'img_12345', date: '01/01/2025', category: 'Video', videoUrl: 'https://www.youtube.com/watch?v=example' },
  { id: 4, name: 'img_123456', date: '01/01/2025', category: 'Foto', imageUrl: '/galery/galery-3.jpg' },
];

// Category Tag Component
const CategoryTag = ({ category }) => {
  const color = category === 'Foto' ? ' bg-accent-yellow-150 text-accent-yellow-550' : 'bg-accent-blue-175 text-accent-blue-550';
  return (
    <span className={`px-4 py-2 text-body-2 rounded-lg w-24    ${color}`}>
      {category}
    </span>
  );
};

// Preview Media Modal Component
const PreviewMediaModal = ({ media, isOpen, onClose }) => {
  if (!isOpen || !media) return null;

  const defaultPlaceholder = "/images/gambarkucingarticle.png";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-transparent max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          aria-label="Close modal"
          className="absolute -top-10 right-8 z-20 w-10 h-10 bg-accent-yellow-300 rounded-lg flex shadow-md items-center justify-center text-accent-neutral-1000 hover:bg-accent-yellow-400 duration-300 hover:shadow-xl"
        > 
          <CloseIcon className="w-6 h-6" />
        </button>

        {/* Media Content */}
        <div className="relative w-full h-full flex items-center justify-center">
          {media.category === 'Foto' ? (
            <img
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              alt={media.name}
              src={media.imageUrl || defaultPlaceholder}
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = defaultPlaceholder; 
              }}
            />
          ) : (
            <div className="w-full max-w-4xl aspect-video bg-black rounded-lg flex items-center justify-center">
              <iframe
                className="w-full h-full rounded-lg"
                src={media.videoUrl?.replace('watch?v=', 'embed/') || ''}
                title={media.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Tambah Media Modal Component
const TambahMediaModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    kategori: 'Video',
    linkYoutube: 'https://wleowleowleo.com',
    file: null
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    // Reset form
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Tambah Media</h2>
            <p className="text-sm text-gray-500 mt-1">Buat media baru untuk klinik anda</p>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition duration-150"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {formData.kategori === 'Foto'&& (
                      <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Media
                      </label>
                      <div className="relative">
                        <div className="relative border-2 border-gray-300 rounded-lg p-8 text-center  transition duration-150">
                          <div className="relative z-10">
                            <div className="flex justify-center mb-2">
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


          {/* Kategori Media Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
          

          {/* Link Youtube Video (only show if kategori is Video) */}
          {formData.kategori === 'Video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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

          {/* Modal Footer Buttons */}
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
      </div>
    </div>
  );
};

// Management Table Component
const ManagementTable = ({ data, onDelete, onPreview }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-h-8 text-accent-neutral-1000 font-bold  tracking-wider">
              Nama Gambar
            </th>
            <th className="px-6 py-3 text-left text-h-8 text-accent-neutral-1000 font-bold  tracking-wider">
              Tanggal Ditambahkan
            </th>
            <th className="px-6 py-3 text-left text-h-8 text-accent-neutral-1000 font-bold  tracking-wider">
              Kategori Media
            </th>
            <th className="px-6 py-3 text-left text-h-8 text-accent-neutral-1000 font-bold  tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-body-2 text-accent-neutral-1000 ">
                {item.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-body-2 text-accent-neutral-1000">
                {item.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-body-2 text-accent-neutral-1000">
                <CategoryTag category={item.category} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex justify-center space-x-2">
                  <Button 
                    icon={<TrashIcon className="h-4 w-4" />} 
                    roundedClass="rounded-lg"
                    color="bg-accent-red-300" 
                    hoverColor="hover:bg-accent-red-400"
                    onClick={() => onDelete(item.id)}
                    label={`Hapus ${item.name}`}
                  />
                  
                  <Button 
                    icon={<WarningIcon className="h-4 w-4" />} 
                    roundedClass="rounded-lg"
                    color="bg-accent-blue-400" 
                    hoverColor="hover:bg-blue-500"
                    focusColor="focus:bg-accent-blue-300"
                    onClick={() => onPreview(item)}
                    label={`Preview ${item.name}`}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="p-6 text-center text-gray-500">Tidak ada data media yang ditemukan.</div>
      )}
    </div>
  );
};

// Main Component
export default function ManagemenMedia() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaData, setMediaData] = useState(MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on search query
  const filteredData = mediaData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveMedia = (formData) => {
    // Add new media to the list
    const newMedia = {
      id: mediaData.length + 1,
      name: formData.file ? formData.file.name : `video_${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      category: formData.kategori,
      imageUrl: formData.file ? URL.createObjectURL(formData.file) : null,
      videoUrl: formData.kategori === 'Video' ? formData.linkYoutube : null
    };
    setMediaData([...mediaData, newMedia]);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus media ini?')) {
      setMediaData(mediaData.filter(item => item.id !== id));
    }
  };

  const handlePreview = (media) => {
    setSelectedMedia(media);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
    setSelectedMedia(null);
  };

  return (
    <div className="space-y-6">
      {/* Header dengan Judul dan Tombol Tambah Media */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h-7 font-bold text-accent-neutral-1000">Manajemen Media</h1>
          <p className="text-body-2 text-accent-neutral-800">Kelola media klinik anda</p>
        </div>
        
       
        <Button 
          icon={<AddIcon />} 
          color="bg-accent-blue-400" 
          hoverColor="hover:bg-blue-500"
          focusColor="focus:bg-accent-blue-300"
          roundedClass="rounded-lg"
          
          onClick={() => setIsModalOpen(true)}
        >
          Tambah Media
        </Button>
      </div>
     
      {/* card cari gambR */}
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="h-5 w-5 text-accent-neutral-800" />
          </div>
          <input
            type="search"
            placeholder="Cari nama gambar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 text-body-2 text-accent-neutral-800 pr-4 py-2 bg-accent-neutral-200 rounded-xl  transition duration-150"
          />
        </div>

        {/* Tabel Data */}
        <ManagementTable 
          data={filteredData} 
          onDelete={handleDelete}
          onPreview={handlePreview}
        />
      </div>

      {/* Modal Tambah Media */}
      <TambahMediaModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMedia}
      />

      {/* Modal Preview Media */}
      <PreviewMediaModal 
        media={selectedMedia}
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreview}
      />
    </div>
  );
}
