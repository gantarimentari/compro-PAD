'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import articleService from '@/lib/services/articleService';
import { TrashIcon, PenIcon } from '@ds/icons';
import Button from '@ds/ui/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import { TambahArtikelModal, EditArtikelModal, DeleteConfirmModal } from '@ds/dashboard/modals';

const ARTICLE_COLUMNS = [
  { key: 'title', header: 'Judul' },
  { key: 'category', header: 'Kategori' },
  { key: 'status', header: 'Status' },
  { key: 'date', header: 'Tanggal Ditambahkan' },
  { key: 'actions', header: 'Aksi', isAction: true },
];

const StatusTag = ({ status }) => {
  const color = status === 'Draft'
    ? 'bg-accent-yellow-150 text-accent-yellow-550'
    : 'bg-accent-green-50 text-accent-green-450';
  return (
    <span className={`px-4 py-2 text-body-2 rounded-lg w-24 ${color}`}>
      {status}
    </span>
  );
};

const renderCell = (item, key, onEdit, onDelete) => {
  switch (key) {
    case 'status':
      return <StatusTag status={item.status} />;
    case 'actions':
      return (
        <div className="flex justify-center space-x-2">
          <Button
            icon={<PenIcon className="h-4 w-4" />}
            roundedClass="rounded-lg"
            color="bg-accent-yellow-300"
            hoverColor="hover:bg-accent-yellow-500"
            focusColor="focus:bg-accent-yellow-400"
            onClick={() => onEdit(item)}
            label={`Edit ${item.title}`}
          />
          <Button
            icon={<TrashIcon className="h-4 w-4" />}
            roundedClass="rounded-lg"
            color="bg-accent-red-300"
            hoverColor="hover:bg-accent-red-400"
            onClick={() => onDelete(item)}
            label={`Hapus ${item.title}`}
          />
        </div>
      );
    default:
      return item[key];
  }
};

export default function ManagemenArtikel() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleToDelete, setArticleToDelete] = useState(null);

  const { data: articleData = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const data = await articleService.getAll();
      return data.map(item => ({
        id: item.id,
        title: item.title,
        category: item.category,
        status: item.status,
        date: new Date(item.created_at).toLocaleDateString('id-ID'),
        imageUrl: item.imageUrl || null,
        content: item.content,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });

  const filteredData = articleData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveArtikel = async (formData) => {
    try {
      if (!formData.file || !(formData.file instanceof File)) {
        alert('Gambar artikel wajib diisi!');
        return;
      }
      const data = new FormData();
      data.append('title', formData.judul);
      data.append('category', formData.kategori);
      data.append('content', formData.isiArtikel);
      data.append('status', formData.status);
      data.append('image', formData.file);
      await articleService.create(data);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      // ❌ JANGAN close modal! Biarkan modal close sendiri setelah toast
      // setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving article:', err);
      throw err; // Re-throw untuk ditangkap modal;
    }
  };

  const handleEditArtikel = async (id, formData) => {
    try {
      const data = new FormData();
      data.append('title', formData.judul);
      data.append('category', formData.kategori);
      data.append('content', formData.isiArtikel);
      data.append('status', formData.status);
      if (formData.file) data.append('image', formData.file);
      await articleService.update(id, data);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      // ❌ Commented: setIsEditModalOpen(false); setSelectedArticle(null); - Let modal close after showing toast
      // Modal will close itself after displaying SuccessToast for 1500ms
    } catch (err) {
      console.error('Error updating article:', err);
      throw err; // Re-throw for modal error handling
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await articleService.remove(articleToDelete.id);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      setIsDeleteModalOpen(false);
      setArticleToDelete(null);
      alert('Artikel berhasil dihapus!');
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('Gagal menghapus artikel');
    }
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setIsEditModalOpen(true);
  };

  const handleDelete = (article) => {
    setArticleToDelete(article);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Konten Artikel"
        description="Kelola Artikel dan Konten Edukasi"
        addButtonText="Tambah Artikel"
        onAddClick={() => setIsModalOpen(true)}
      />
      <div className="space-y-4">
        <SearchBar
          placeholderText="Cari judul atau kategori..."
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
            columns={ARTICLE_COLUMNS}
            data={filteredData}
            renderCell={(item, key) => renderCell(item, key, handleEdit, handleDelete)}
          />
        )}
      </div>

      <TambahArtikelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveArtikel}
      />
      <EditArtikelModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedArticle(null); }}
        onSave={handleEditArtikel}
        article={selectedArticle}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setArticleToDelete(null); }}
        onConfirm={handleConfirmDelete}
        itemName={articleToDelete?.title || ''}
        itemType="artikel"
      />
    </div>
  );
}
