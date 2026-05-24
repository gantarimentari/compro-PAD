// "use client";
import React from 'react';
import BaseModal from '../../shared-modals/BaseModal';
import ButtonSaveandClose from '../../shared-modals/ButtonSaveandClose';

const TambahFAQModal = ({ isOpen, onClose, onSave, editingData, isSubmitting }) => {
  const [formData, setFormData] = React.useState({
    status: 'draft',
    question: '',
    answer: '',
  });

  React.useEffect(() => { // tanpa harus import useEffect, karena sudah import React
    if (isOpen && editingData) {
      setFormData({
        question: editingData.question || '',
        answer: editingData.answer || '',
        status: editingData.status?.toLowerCase() || 'draft',
      });
      return;
    }

    if (isOpen) {
      setFormData({ question: '', answer: '', status: 'draft' });
    }
  }, [editingData, isOpen]);

  const title = editingData ? 'Edit FAQ' : 'Tambah FAQ';
  const description = editingData ? 'Perbarui pertanyaan dan jawaban' : 'Tambahkan pertanyaan dan jawaban yang sering diajukan';

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
    >
      <form 
        onSubmit={handleSubmit}
        className="space-y-2 px-6 pt-2 pb-6"
      >
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Judul
          </label>
          <input
            type="text"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            placeholder="Masukkan judul FAQ"
            className="whitespace-normal w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2 placeholder:text-accent-neutral-800"
            required              
          />
        </div>
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Deskripsi
          </label>
          <textarea
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            placeholder="Tuliskan Deskripsi FAQ di sini..."
            rows={4}
            className="whitespace-normal w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2 placeholder:text-accent-neutral-800"
            required              
          />
        </div>
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            
            className="text-body-2 w-full px-4 font-bold py-2 border bg-accent-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 "
            required              
          >
            <option value="draft" className="text-accent-neutral-1000">
              Draft
            </option>
            <option value="publish" className="text-accent-neutral-1000">
              Publish
            </option>
          </select>
        </div>

        <ButtonSaveandClose onClose={onClose} isSubmitting={isSubmitting} />
      </form>
    </BaseModal>
  );
};
export default TambahFAQModal;