'use client';

import axios from 'axios';
import { useEffect } from 'react';
import React, { useState } from 'react';
import { TrashIcon, WarningIcon} from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import {
  TambahMediaModal,
  PreviewMediaModal,
  DeleteConfirmModal
} from '@ds/dashboard/modals';

// Columns 
const MEDIA_COLUMNS = [
  { key: 'name', header: 'Nama Gambar' },
  { key: 'date', header: 'Tanggal Ditambahkan' },
  { key: 'category', header: 'Kategori Media' },
  { key: 'actions', header: 'Aksi', isAction: true },
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
}

// Main Component
export default function ManagemenMedia() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedMedia, setSelectedMedia] = useState(null);

  const [mediaToDelete, setMediaToDelete] = useState(null);
  const [mediaData, setMediaData] = useState([]);

  useEffect(() => {
    axios.get('/laravel/api/media', {
      withCredentials: true,
    })
    .then((res) => setMediaData(res.data))
    .catch((err) => console.error('error fetching media: ', err));
  }, []);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on search query
  const filteredData = mediaData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveMedia = async (formData) => {
    // Add new media to the list
    const uploadData = new FormData();
    uploadData.append('category', formData.kategori);
    if(formData.file) uploadData.append('file', formData.file);
    if(formData.linkYoutube) uploadData.append('video_url', formData.linkYoutube);
    try{
      const res = await axios.post('/laravel/api/media',uploadData, {
        headers: { 'Content-Type': 'multipart/form-data'},
        withCredentials: true,
      });
      setMediaData([...mediaData, res.data]);
    }catch(err){
      console.error('eror uploading media:', err);
    }
    // const newMedia = {
    //   id: mediaData.length + 1,
    //   name: formData.file ? formData.file.name : `video_${Date.now()}`,
    //   date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    //   category: formData.kategori,
    //   imageUrl: formData.file ? URL.createObjectURL(formData.file) : null,
    //   videoUrl: formData.kategori === 'Video' ? formData.linkYoutube : null
    // };
    // setMediaData([...mediaData, newMedia]);
  };

  const handleDelete = (id) => {
    setMediaToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (mediaToDelete) {
      try{
        await axios.delete('http://localhost:8000/api/media/${mediaToDelete}',{
          withCredentials: true,
        });
        setMediaData(mediaData.filter((item) => item.id !== mediaToDelete));
      } catch(err){
        console.error('error deleting media:', err);
      }
      setIsDeleteModalOpen(false);
      setMediaToDelete(null);
      // setMediaData(mediaData.filter(item => item.id !== mediaToDelete));
      // setIsDeleteModalOpen(false);
      // setMediaToDelete(null);
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
      <PageHeader 
        title="Manajemen Media"
        description="Kelola media klinik anda"
        addButtonText="Tambah Media"
        onAddClick={() => setIsModalOpen(true)}
      />
     
      <div className="space-y-4">
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