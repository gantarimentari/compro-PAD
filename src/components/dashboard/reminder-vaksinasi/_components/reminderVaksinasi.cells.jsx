import React from 'react';
import Button from '@/components/ui/Button';
import { PenIcon, TrashIcon } from '@/components/icons';
import { NEXT_DATE_URGENCY_CLASS, STATUS_BADGE_CLASS } from '../reminderVaksinasi.constants';

const renderStatusTag = (status) => (
  <span className={`inline-flex px-4 py-2 rounded-lg text-body-2 ${STATUS_BADGE_CLASS[status] || 'bg-gray-100 text-gray-700'}`}>
    {status}
  </span>
);

export const createReminderCellRenderer = ({ onDelete, onOpenAction }) => {
  return (item, key) => {
    switch (key) {
      case 'petName': {
        return (
          <div className="whitespace-normal max-w-xs">
            <p className="text-body-2 text-accent-neutral-1000">{item.petName}</p>
            <p className="text-body-5 text-accent-neutral-500">{item.species || '-'}</p>
          </div>
        );
      }
      case 'ownerName': {
        return (
          <div className="whitespace-normal max-w-xs">
            <p className="text-body-2 text-accent-neutral-1000">{item.ownerName}</p>
            <p className="text-body-5 text-accent-neutral-500">{item.ownerPhone || '-'}</p>
          </div>
        );
      }
      case 'vaccinationType': {
        return (
          <div className="whitespace-normal max-w-xs">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-body-2 text-[#155DFC] bg-[#EFF6FF] border border-[#BEDBFF] px-3 text-body-2 rounded-full">{item.vaccinationType}</p>
            </div>
            <p className="text-body-5 text-accent-neutral-500">Interval: {item.vaccineInterval ?? '-'} bulan</p>
          </div>
        );
      }
      case 'latestVaccinationDate': {
        return (
          <div className="whitespace-normal max-w-xs">
            <p className="text-body-2 text-accent-neutral-1000">{item.latestVaccinationDate}</p>
            <p className="text-body-5 text-accent-neutral-500">#1 kali vaksin</p>
          </div>
        );
      }
      case 'nextVaccinationDate': {
        const selectedStyle = NEXT_DATE_URGENCY_CLASS[item.nextVaccinationUrgency] || NEXT_DATE_URGENCY_CLASS.normal;

        return (
          <div className="whitespace-normal max-w-xs">
            <p className={`text-body-2 ${selectedStyle.date}`}>{item.nextVaccinationDate}</p>
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
              onClick={()=>{
                if (item.status !=='Selesai'){
                  onOpenAction(item)
                }
              }}
              className={`px-5 py-2 rounded-lg text-white text-body-2 ${item.status === 'Selesai' ? 'bg-[#DCFCE7]  text-[#008236] cursor-default' : 'bg-accent-green-400 hover:bg-accent-green-500'}`}
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
              onClick={() => onDelete(item)}
              label={`Hapus ${item.petName}`}
            />
          </div>
        );
      }
      default:
        return item[key] || '-';
    }
  };
};
