'use client';
import reminderVaksinasiService from '@/lib/services/reminderVaksinasi';
import hewanService from '@/lib/services/hewanService';
import jenisVaksinService from '@/lib/services/jenisVaksinService';
import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PenIcon, TrashIcon } from '@/components/icons';
import Table from '@/components/shared/Table';
import SearchBar from '@/components/shared/ManagementSearch';
import PageHeader from '@/components/shared/PageHeader';
import { TambahReminderVaksinasiModal, DeleteConfirmModal  } from '@/components/dashboard';
import Button from '@/components/ui/Button';

const Vaccination_COLUMNS = [
  
  { key: 'petName', header: 'Hewan' },
  { key: 'ownerName', header: 'Pemilik ' },
  { key: 'vaccinationType', header: 'Jenis Vaksin' },
  { key: 'latestVaccinationDate', header: 'Vaksinasi Terakhir' },
  { key: 'nextVaccinationDate', header: 'Jadwal Berikutnya' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: 'Aksi', isAction: true },
];

export default function ReminderVaksinasi() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState(null);

  const handleDelete = (item) => {
    setReminderToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (payload) => reminderVaksinasiService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminder-vaksinasi-list'] });
    },
  });

  const { data: vaksinasiData = [], isLoading } = useQuery({
    queryKey: ['reminder-vaksinasi-list'],
    queryFn: async () => {
      const formatDateID = (value) =>
        value.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });

      const addMonthsToDate = (dateValue, monthInterval) => {
        const parsedDate = new Date(dateValue);
        if (Number.isNaN(parsedDate.getTime())) return null;

        const result = new Date(parsedDate);
        result.setMonth(result.getMonth() + monthInterval);
        return result;
      };

      const getNextDateHint = (nextDate) => {
        if (!nextDate) return '-';

        const today = new Date();
        const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startNext = new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());
        const dayDiff = Math.ceil((startNext - startToday) / (1000 * 60 * 60 * 24));

        if (dayDiff === 0) return 'Hari ini';
        if (dayDiff > 0) return `${dayDiff} hari lagi`;
        return `Terlewat ${Math.abs(dayDiff)} hari`;
      };

      const getDayDiff = (nextDate) => {
        if (!nextDate) return null;

        const today = new Date();
        const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startNext = new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());
        return Math.ceil((startNext - startToday) / (1000 * 60 * 60 * 24));
      };

      const getUrgencyLevel = (dayDiff) => {
        if (dayDiff === null) return 'normal';
        if (dayDiff < 0) return 'overdue';
        if (dayDiff <= 1) return 'very-soon';
        if (dayDiff < 14) return 'soon';
        return 'normal';
      };

      const [rawReminder, rawHewan, rawJenisVaksin] = await Promise.all([
        reminderVaksinasiService.getAll(),
        hewanService.getAll(),
        jenisVaksinService.getAll(),
      ]);

      const reminderRows = Array.isArray(rawReminder)
        ? rawReminder
        : Array.isArray(rawReminder?.data)
          ? rawReminder.data
          : [];

      const groupedHewan = Array.isArray(rawHewan) ? rawHewan : [];
      const hewanMetaMap = new Map(
        groupedHewan.flatMap((owner) => {
          const ownerName = owner?.name ?? owner?.username ?? '-';
          const ownerPhone = owner?.phone_number ?? owner?.phone ?? '-';
          const pets = Array.isArray(owner?.pets) ? owner.pets : [];

          return pets.map((pet) => [
            String(pet?.id),
            {
              speciesName: pet?.speciesName ?? '-',
              ownerName,
              ownerPhone,
            },
          ]);
        })
      );

      const vaksinRows = Array.isArray(rawJenisVaksin)
        ? rawJenisVaksin
        : Array.isArray(rawJenisVaksin?.data)
          ? rawJenisVaksin.data
          : [];

      const vaksinMap = new Map(
        vaksinRows.map((item) => [
          String(item?.id_vaksinasi ?? item?.id ?? item?.id_vaksin ?? item?.vaksin_id),
          {
            namaVaksin: item?.nama_vaksin ?? '-',
            interval: item?.interval ?? '-',
          },
        ])
      );

      return reminderRows.map((item, index) => {
        const hewanId = String(item?.id_hewan ?? item?.hewan?.id_hewan ?? item?.hewan?.id ?? '');
        const vaksinId = String(item?.id_jenis_vaksin ?? '');
        const hewanMeta = hewanMetaMap.get(hewanId);
        const vaksinMeta = vaksinMap.get(vaksinId);
        const ownerFromReminder = item?.hewan?.pasien;
        const intervalMonths = Number(vaksinMeta?.interval ?? 0);
        const latestVaccinationRawDate = item?.tanggal_vaksin ? new Date(item.tanggal_vaksin) : null;
        const hasValidLatestDate = latestVaccinationRawDate && !Number.isNaN(latestVaccinationRawDate.getTime());
        const nextVaccinationRawDate = hasValidLatestDate && intervalMonths > 0
          ? addMonthsToDate(latestVaccinationRawDate, intervalMonths)
          : null;
        const nextVaccinationDayDiff = getDayDiff(nextVaccinationRawDate);
        const nextVaccinationUrgency = getUrgencyLevel(nextVaccinationDayDiff);

        const uiStatusList = ['Selesai', 'Terkirim', 'Terlewat', 'Dijadwalkan'];
        const uiStatus = uiStatusList[index % uiStatusList.length];

        return {
          id: item?.id_vaksinasi ?? item?.id ?? `${hewanId}-${index}`,
          petName: item?.hewan?.nama_hewan ?? '-',
          species: hewanMeta?.speciesName ?? '-',
          ownerName: ownerFromReminder?.username ?? ownerFromReminder?.name ?? hewanMeta?.ownerName ?? '-',
          ownerPhone: ownerFromReminder?.phone_number ?? ownerFromReminder?.phone ?? hewanMeta?.ownerPhone ?? '-',
          vaccinationType: vaksinMeta?.namaVaksin ?? '-',
          vaccineInterval: vaksinMeta?.interval,
          latestVaccinationDate: hasValidLatestDate ? formatDateID(latestVaccinationRawDate) : '-',
          nextVaccinationDate: nextVaccinationRawDate ? formatDateID(nextVaccinationRawDate) : '-',
          nextVaccinationHint: getNextDateHint(nextVaccinationRawDate),
          nextVaccinationUrgency,
          status: uiStatus,
        };
      });
    },
    staleTime: 5 * 60 * 1000,
  });

  const filteredData = useMemo(() => {
    const searchValue = searchQuery.toLowerCase();
    return vaksinasiData
      .filter((item) => {
        const matchesSearch =
          item.petName.toLowerCase().includes(searchValue) ||
          item.ownerName.toLowerCase().includes(searchValue) ||
          item.vaccinationType.toLowerCase().includes(searchValue);

        const matchesStatus =
          statusFilter === 'Semua Status' ||
          item.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
      });
  }, [vaksinasiData, searchQuery, statusFilter]);

  const renderStatusTag = (status) => {
    const statusColor = {
      Selesai: 'bg-accent-green-50 text-accent-green-450',
      Terkirim: 'bg-accent-blue-50 text-accent-blue-400',
      Terlewat: 'bg-accent-red-50 text-accent-red-450',
      Dijadwalkan: 'bg-accent-yellow-50 text-[#B8860B]',
    };

    return (
      <span className={`inline-flex px-4 py-2 rounded-lg text-body-2 ${statusColor[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  const renderCell = (item, key) => {
    switch (key) {
      case 'petName': {
        return (
          <div className="whitespace-normal max-w-xs">
            <p className="text-accent-neutral-1000">{item.petName}</p>
            <p className="text-body-5 text-accent-neutral-500">{item.species || '-'}</p>
          </div>
        );
      }
      case 'ownerName': {
        return (
          <div className="whitespace-normal max-w-xs">
            <p className="text-accent-neutral-1000">{item.ownerName}</p>
            <p className="text-body-5  text-accent-neutral-500">{item.ownerPhone || '-'}</p>
          </div>
        );
      }
      case 'vaccinationType': {
        return (
          <div className="whitespace-normal max-w-xs">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[#155DFC] bg-[#EFF6FF] border border-[#BEDBFF] px-3  text-body-2 rounded-full">{item.vaccinationType}</p>
              </div>
            
            <p className="text-body-5 text-accent-neutral-500">Interval: {item.vaccineInterval ?? '-'} bulan</p>
          </div>
        );
      }
      case 'latestVaccinationDate': {
        return (
          <div className="whitespace-normal max-w-xs">
            <p className="text-accent-neutral-1000">{item.latestVaccinationDate}</p>
            
            <p className="text-body-5    text-accent-neutral-500">#1 kali vaksin</p>
          </div>
        );
      }
      case 'nextVaccinationDate': {
        const urgencyStyle = {
          overdue: {
            date: 'text-accent-red-450',
            hint: 'text-accent-red-450',
          },
          'very-soon': {
            date: 'text-[#F54900]',
            hint: 'text-[#F54900]',
          },
          soon: {
            date: 'text-[#B8860B]',
            hint: 'text-[#B8860B]',
          },
          normal: {
            date: 'text-accent-neutral-1000',
            hint: 'text-accent-neutral-500',
          },
        };

        const selectedStyle = urgencyStyle[item.nextVaccinationUrgency] || urgencyStyle.normal;

        return (
          <div className="whitespace-normal max-w-xs">
            <p className={selectedStyle.date}>{item.nextVaccinationDate}</p>
            <p className={`text-body-5 ${selectedStyle.hint}`}>{item.nextVaccinationHint}</p>
          </div>
        );
      }
      case 'status': {
        return renderStatusTag(item.status);
      }
      case 'actions': {
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`px-5 py-2 rounded-lg text-white text-body-2 ${item.status === 'Selesai' ? 'bg-accent-green-450 hover:bg-accent-green-500' : 'bg-[#11A7A4] hover:bg-[#0D8C89]'}`}
            >
              {item.status === 'Selesai' ? 'Selesai' : 'Vaksinasi'}
            </button>
            <button type="button" className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">⟳</button>
            <button type="button" className="p-2 rounded-lg bg-accent-yellow-300 hover:bg-accent-yellow-400">
              <PenIcon className="w-4 h-4" />
            </button>
            <Button
              icon={<TrashIcon className="h-4 w-4" />}
              roundedClass="rounded-lg"
              color="bg-accent-red-300"
              hoverColor="hover:bg-accent-red-400"
              onClick={() => handleDelete(item)}
              label={`Hapus ${item.type}`}/>
          </div>
        );
      }
      default:
        return item[key] || '-';
    }
  };

  const handleSaveReminder = async (formData) => {
    await createMutation.mutateAsync({
      id_hewan: formData.id_hewan,
      id_jenis_vaksin: formData.id_jenis_vaksin,
      tanggal_vaksin: formData.tanggal_vaksin,
    });
  };
  const handleConfirmDelete = async () => {
    try {
      await reminderVaksinasiService.remove(reminderToDelete.id);
      queryClient.invalidateQueries({ queryKey: ['reminder-vaksinasi'] });
      setIsDeleteModalOpen(false);
      setReminderToDelete(null);
    } catch (err) {
      alert('Gagal menghapus!');
    }
  };
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Reminder Vaksinasi" 
        description="Kelola pengingat jadwal vaksinasi hewan" 
        addButtonText="Tambah Reminder" 
        onAddClick={() => setIsModalOpen(true)} 
      />
      
      <div className="space-y-4 pb-32">
        <div className="flex flex-col md:flex-row gap-3 justify-start">
          <div className="">
            <SearchBar 
              placeholderText="Cari hewan, vaksin, atau pemilik..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-body-2 text-accent-neutral-800 min-w-[180px] bg-accent-neutral-200 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-body-2"
          >
            <option>Semua Status</option>
            <option>Selesai</option>
            <option>Terkirim</option>
            <option>Terlewat</option>
            <option>Dijadwalkan</option>
          </select>
        </div>
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-3">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : (
          <Table columns={Vaccination_COLUMNS} data={filteredData} renderCell={renderCell} />
        )}
      </div>

      <TambahReminderVaksinasiModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveReminder}/>
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} itemName={reminderToDelete?.type} itemType="reminder vaksinasi" 
      description={"Apakah Anda yakin ingin menghapus reminder ini? Tindakan ini tidak dapat dibatalkan."}/>    
    </div>
  );
}