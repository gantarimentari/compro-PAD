'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import mediaService from '@/lib/services/mediaService';
import { TrashIcon, WarningIcon } from '@/components/icons';
import Button from '@/components/ui/Button';
import Table from '@/components/shared/Table';
import SearchBar from '@/components/shared/ManagementSearch';
import PageHeader from '@/components/shared/PageHeader';
import { TambahMediaModal, PreviewMediaModal, DeleteConfirmModal } from '@/components/dashboard';

const MEDIA_COLUMNS = [
  { key: 'name', header: 'Nama Gambar' },
  { key: 'date', header: 'Tanggal Ditambahkan' },
  { key: 'category', header: 'Kategori Media' },
  { key: 'actions', header: 'Aksi', isAction: true },
];

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

export default function ManagemenMedia() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaToDelete, setMediaToDelete] = useState(null);

  const { data: mediaData = [], isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      const res = await mediaService.getAll();
      return res.map(item => ({
        id: item.id,
        name: item.name || 'Untitled',
        date: item.date || item.timeStamp || new Date().toLocaleDateString('id-ID'),
        category: item.category || 'Foto',
        imageUrl: item.imageUrl || null,
        videoUrl: item.videoUrl || null,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });

  const filteredData = mediaData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveMedia = async (formData) => {
    try {
      const uploadData = new FormData();
      uploadData.append('category', formData.kategori);
      if (formData.file) uploadData.append('file', formData.file);
      if (formData.linkYoutube) uploadData.append('video_url', formData.linkYoutube);
      await mediaService.create(uploadData);
      queryClient.invalidateQueries({ queryKey: ['media'] });
      // ❌ Commented: setIsModalOpen(false); - Let modal close after showing toast
      // Modal will close itself after displaying SuccessToast for 1500ms
    } catch (err) {
      console.error('Error uploading media:', err);
      throw err; // Re-throw for modal error handling
    }
  };

  const handleDelete = (id) => {
    setMediaToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await mediaService.remove(mediaToDelete);
      queryClient.invalidateQueries({ queryKey: ['media'] });
      setIsDeleteModalOpen(false);
      setMediaToDelete(null);
      alert('Media berhasil dihapus!');
    } catch (err) {
      console.error('Error deleting media:', err);
      alert('Gagal menghapus media');
    }
  };

  const handlePreview = (media) => {
    setSelectedMedia(media);
    setIsPreviewModalOpen(true);
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
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <Table
            columns={MEDIA_COLUMNS}
            data={filteredData}
            renderCell={(item, key) => renderCell(item, key, handleDelete, handlePreview)}
          />
        )}
      </div>

      <TambahMediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMedia}
      />
      <PreviewMediaModal
        media={selectedMedia}
        isOpen={isPreviewModalOpen}
        onClose={() => { setIsPreviewModalOpen(false); setSelectedMedia(null); }}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setMediaToDelete(null); }}
        onConfirm={handleConfirmDelete}
        itemName={mediaData.find(item => item.id === mediaToDelete)?.name || ''}
        itemType="media"
      />
    </div>
  );
}
