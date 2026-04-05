import React from 'react';
import ReminderActionButtons from './ReminderActionButtons';

import { NEXT_DATE_URGENCY_CLASS, STATUS_BADGE_CLASS } from '../reminderVaksinasi.constants';


const renderStatusTag = (status) => {
  const config = STATUS_BADGE_CLASS[status] || { 
    text: 'text-gray-700', 
    bg: 'bg-gray-100' 
  };
  return (
  <div className={`text-center whitespace-normal max-w-xs  ${config.bg || 'bg-gray-100'} rounded-lg`}>
    <span className={`inline-flex px-4 py-2  text-body-2 rounded-lg  ${config.text || ' text-gray-700'}`}>    
    {status}
  </span>
  </div>
  );
  
};

export const createReminderCellRenderer = ({ onDelete, onOpenAction, onOpenEdit, onOpenHistory, onOpenSchedule, onOpenSend }) => {
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
            <p className="text-body-5 text-accent-neutral-500">{item.latestVaccinationCountLabel || '-'}</p>
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
          <ReminderActionButtons
            item={item}
            onDelete={onDelete}
            onOpenAction={onOpenAction}
            onOpenEdit={onOpenEdit}
            onOpenHistory={onOpenHistory}
            onOpenSchedule={onOpenSchedule}
            onOpenSend={onOpenSend}
          />
        );
      }
      default:
        return item[key] || '-';
    }
  };
};
