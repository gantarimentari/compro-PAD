'use client';

import React, { useState } from 'react';
import articleService from '@/lib/services/articleService';
import { SearchIcon, CloseIcon, TrashIcon, AddIcon, PenIcon, UploadIcon} from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import {
  TambahArtikelModal,
  EditArtikelModal,
  DeleteConfirmModal
} from '@ds/dashboard/modals';

// Columns definition
const ARTICLE_COLUMNS = [
  { key: 'title', header: 'Judul' },
  { key: 'category', header: 'Kategori' },
  { key: 'status', header: 'Status' },
  { key: 'date', header: 'Tanggal Ditambahkan' },
  { key: 'actions', header: 'Aksi', isAction: true },
];

// status tag
const StatusTag = ({ status }) => {
  const color = status === 'Draft' ? 'bg-accent-yellow-150 text-accent-yellow-550' : 'bg-accent-green-50 text-accent-green-450';
  return (
    <span className={`px-4 py-2 text-body-2 rounded-lg w-24 ${color}`}>
      {status}
    </span>
  );
};

// Render cell function
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

// Main Component
export default function ManagemenArtikel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [articleData, setArticleData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCsrfAndArticles = async() => {
    try {
      setIsLoading(true);
      const data = await articleService.getAll();

      console.log('Fetched articles:', res.data);

      const formatted = data.map(item => ({
        id: item.id,
        title: item.title,
        category: item.category,
        status: item.status,
        date: new Date(item.created_at).toLocaleDateString('id-ID'),
        imageUrl: item.image ? process.env.NEXT_PUBLIC_STORAGE_URL + item.image : "/images/default.png",
        content: item.content
      }));

      setArticleData(formatted);
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCsrfAndArticles();
  }, []);

  // Filter data based on search query
  const filteredData = articleData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveArtikel = async (formData) => {
    try {
      const data = new FormData();
      data.append("title", formData.judul);
      data.append("category", formData.kategori);
      data.append("content", formData.isiArtikel);
      data.append("status", formData.status);
      if (formData.file && formData.file instanceof File) {
        data.append("image", formData.file);
      }

      await articleService.create(data);

      await fetchCsrfAndArticles();
      setIsModalOpen(false);
      alert('Artikel berhasil ditambahkan!');
    } catch (err) {
      console.error('Error saving article:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers
      });
      alert(`Gagal menyimpan artikel: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEditArtikel = async (id, formData) => {
    try {
      const data = new FormData();
      data.append("title", formData.judul);
      data.append("category", formData.kategori);
      data.append("content", formData.isiArtikel);
      data.append("status", formData.status);
      if (formData.file) data.append("image", formData.file);

      await articleService.update(id, data);
      await fetchCsrfAndArticles();
      setIsEditModalOpen(false);
      setSelectedArticle(null);
      alert('Artikel berhasil diupdate!');
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers
      });
      alert(`Gagal mengupdate artikel: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = (article) => {
    setArticleToDelete(article);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (articleToDelete) {
      try {
        await articleService.remove(articleToDelete.id);        await fetchCsrfAndArticles();
        setIsDeleteModalOpen(false);
        setArticleToDelete(null);
        alert('Artikel berhasil dihapus!');
      } catch (err) {
        console.error('Error deleting article:', err);
        alert('Gagal menghapus artikel');
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setArticleToDelete(null);
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <div className="space-y-6">
      {/* Hanya satu PageHeader */}
      <PageHeader 
        title="Konten Artikel"
        description="Kelola Artikel dan Konten Edukasi"
        addButtonText="Tambah Artikel"
        onAddClick={() => setIsModalOpen(true)}
      />
     
      <div className="space-y-4">
        {/* Hanya satu SearchBar */}
        <SearchBar
          placeholderText="Cari judul atau kategori..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-3">
            {[1,2,3,4,5].map(i => (
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

      {/* Modals */}
      <TambahArtikelModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveArtikel}
      />

      <EditArtikelModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        onSave={handleEditArtikel}
        article={selectedArticle}
      />

      {/* Hanya satu DeleteConfirmModal */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={articleToDelete?.title || ''}
        itemType="artikel"
      />
    </div>
  );
}