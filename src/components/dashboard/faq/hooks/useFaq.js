import {useMemo, useState} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import FaqService from '@/lib/services/faqService';

export const useFaq = (options = { publicOnly: false }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState({ show: false, message: '' });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const[searchTerm, setSearchTerm] = useState('');

  const {data, isLoading} = useQuery({
    queryKey: ['faqs', options.publicOnly],
    queryFn: () => FaqService.getAll(),
    staleTime: 5 * 60 * 1000, // data dianggap "segar" selama 5 menit
    keepPreviousData: true,
  });
  const allData = data?.data || [];

  const faqs = useMemo(() => {
    const baseData = options.publicOnly
      ? allData.filter(faq => faq.status?.toLowerCase() === 'publish')
      : allData;

    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return baseData;

    return baseData.filter((faq) => {
      const searchableText = [faq.question, faq.answer, faq.title, faq.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [allData, options.publicOnly, searchTerm]);

  const triggerSuccess = (message) => {
    setSuccessToast({ show: true, message });
    window.clearTimeout(triggerSuccess.timerId);
    triggerSuccess.timerId = window.setTimeout(() => {
      setSuccessToast({ show: false, message: '' });
    }, 2000);
  };

  const createMutation = useMutation({
    mutationFn: (newFaq) => FaqService.create(newFaq),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['faqs']});
      setIsModalOpen(false);
      setEditingData(null);
      triggerSuccess('FAQ berhasil ditambahkan');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({id, ...payload}) => FaqService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['faqs']});
      setIsModalOpen(false);
      setEditingData(null);
      triggerSuccess('FAQ berhasil diperbarui');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => FaqService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['faqs']});
      setIsDeleteModalOpen(false);
      setSelectedId(null);
    }
  });

  const openEditModal = (faq) => {
    setEditingData(faq);
    setIsModalOpen(true);
  };

  const openPreviewModal=(faq)=>{
    setSelectedFaq(faq);
    setIsPreviewOpen(true);
  }
  const closePreviewModal=()=>{
    setSelectedFaq(null);
    setIsPreviewOpen(false);
  }

  const handleSave = (payload) => {
    if (editingData) {
      updateMutation.mutate({id: editingData.id ?? editingData.id_faq, ...payload});
    } else {
      createMutation.mutate(payload);
    }
  };

  return {
    faqs,
    isLoading,
    isModalOpen,
    searchTerm,
    setSearchTerm,
    openModal: () => {
      setEditingData(null);
      setIsModalOpen(true);
    },
    closeModal: () => {
      setIsModalOpen(false);
      setEditingData(null);
    },
    handleSave,
    isSaving: createMutation.isLoading || updateMutation.isLoading,

    isDeleteModalOpen,
    setIsDeleteModalOpen,
    openDeleteModal: (id) => {
      setSelectedId(id);
      setIsDeleteModalOpen(true);
    },
    handleDelete: () => deleteMutation.mutate(selectedId),

    editingData,
    openEditModal,
    successToast,
    isPreviewOpen,
    selectedFaq,
    openPreviewModal,
    closePreviewModal,
  }
};