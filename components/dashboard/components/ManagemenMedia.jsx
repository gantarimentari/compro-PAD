'use client';

import api from '@lib/api';
import { useEffect } from 'react';
import React, { useState } from 'react';
import { TrashIcon, WarningIcon } from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import {
  TambahMediaModal,
  PreviewMediaModal,
  DeleteConfirmModal
} from '@ds/dashboard/modals';

// Columns definition
const MEDIA_COLUMNS = [
  { key: 'name', header: 'Nama Gambar' },
  { key: 'date', header: 'Tanggal Ditambahkan' },
  { key: 'category', header: 'Kategori Media' },
  { key: 'actions', header: 'Aksi', isAction: true },
];

// Category Tag Component
const CategoryTag = ({ category }) => {
  const color = category === 'Foto' 
    ? 'bg-accent-yellow-150 text-accent-yellow-550' 
    : 'bg-accent-blue-175 text-accent-blue-550';
  return (
    <span className={`px-4 py-2 text-body-2 rounded-lg w-24 ${color}`}>
      {category}
    </span>
  );
};

const renderCell = (item, key, onDelete, onPreview) => {
  switch (key) {
    case 'category':
      return <CategoryTag category={item.category} />;
    case 'actions':
      return (
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
            hoverColor="hover:bg-accent-blue-500"
            focusColor="focus:bg-accent-blue-300"
            onClick={() => onPreview(item)}
            label={`Preview ${item.name}`}
          />
        </div>
      );
    default:
      return item[key];
  }
};

// Main Component
export default function ManagemenMedia() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const [mediaData, setMediaData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  //  Fetch media dari database
  const fetchMedia = async () => {
    try {
      console.log('🔄 Fetching media from API...');
      await api.get('/sanctum/csrf-cookie');
      const res = await api.get('/api/media');
      
      console.log('📦 Raw API Response:', res.data);
      console.log('📊 Response type:', typeof res.data);
      console.log('📊 Is Array:', Array.isArray(res.data));
      
      if (res.data && res.data.length > 0) {
        console.log('🔍 First item structure:', res.data[0]);
        console.log('🔍 First item keys:', Object.keys(res.data[0]));
      }
      
      const formatted = res.data.map((item, index) => {
        console.log(`\n📝 Processing item ${index + 1}:`, {
          id: item.id,
          name: item.name,
          category: item.category,
          imageUrl: item.imageUrl,
          videoUrl: item.videoUrl,
          date: item.date,
          timeStamp: item.timeStamp,
          //  Cek juga snake_case
          image_url: item.image_url,
          video_url: item.video_url
        });
        
        return {
          id: item.id,
          name: item.name || 'Untitled',
          date: item.date || item.timeStamp || new Date().toLocaleDateString('id-ID'),
          category: item.category || 'Foto',
          imageUrl: item.imageUrl || null,
          videoUrl: item.videoUrl || null
        };
      });
      
      console.log(' Formatted Data:', formatted);
      setMediaData(formatted);
    } catch (err) {
      console.error('❌ Error fetching media:', err);
      console.error('❌ Error response:', err.response?.data);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Filter data based on search query
  const filteredData = mediaData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveMedia = async (formData) => {
    try {
      await api.get('/sanctum/csrf-cookie');
      
      const uploadData = new FormData();
      uploadData.append('category', formData.kategori);
      
      if (formData.file) {
        uploadData.append('file', formData.file);
      }
      
      if (formData.linkYoutube) {
        uploadData.append('video_url', formData.linkYoutube);
      }

      await api.post('/api/media', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      await fetchMedia(); // Refresh data
      setIsModalOpen(false);
      alert(' Media berhasil ditambahkan!');
    } catch (err) {
      console.error('Error uploading media:', err);
      alert('Gagal menambahkan media, coba dengan file gambar');
    }
  };

  const handleDelete = (id) => {
    setMediaToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (mediaToDelete) {
      try {
        await api.get('/sanctum/csrf-cookie');
        //  Fix: Pakai template literal yang benar
        await api.delete(`/api/media/${mediaToDelete}`);
        
        await fetchMedia(); // Refresh data
        setIsDeleteModalOpen(false);
        setMediaToDelete(null);
        alert(' Media berhasil dihapus!');
      } catch (err) {
        console.error('Error deleting media:', err);
        alert('❌ Gagal menghapus media');
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setMediaToDelete(null);
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
      {/*  Hanya satu PageHeader */}
      <PageHeader 
        title="Manajemen Media"
        description="Kelola media klinik anda"
        addButtonText="Tambah Media"
        onAddClick={() => setIsModalOpen(true)}
      />
     
      <div className="space-y-4">
        {/*  Hanya satu SearchBar */}
        <SearchBar
          placeholderText="Cari nama gambar..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <Table 
          columns={MEDIA_COLUMNS}
          data={filteredData}
          renderCell={(item, key) => renderCell(item, key, handleDelete, handlePreview)}
        />
      </div>

      <TambahMediaModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMedia}
      />

      <PreviewMediaModal 
        media={selectedMedia}
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreview}
      />

      {/*  Hanya satu DeleteConfirmModal */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={mediaData.find(item => item.id === mediaToDelete)?.name || ''}
        itemType="media"
      />
    </div>
  );
}