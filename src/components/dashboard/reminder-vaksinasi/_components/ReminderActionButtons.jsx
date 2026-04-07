import React from 'react';
import Button from '@/components/ui/Button';
import { PenIcon, TrashIcon, RetryIcon, HistoryIcon, SendIcon } from '@/components/icons';

const ReminderActionButtons = ({
  item,
  onDelete,
  onOpenAction,
  onOpenEdit,
  onOpenHistory,
  onOpenSchedule,
  onOpenSend,
}) => {
  const isCompleted = item.status === 'Selesai';
  const isOverdue = item.status === 'Terlewat';
  const canSendReminder = !isCompleted && !item.reminderSent && !item.reminderScheduled;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          if (!isCompleted) {
            onOpenAction(item);
          }
        }}
        className={`px-5 py-2 rounded-lg text-body-2 ${
          isCompleted
            ? 'bg-[#DCFCE7] text-[#008236] cursor-default'
            : 'bg-accent-green-400 hover:bg-accent-green-500 text-white'
        }`}
      >
        {isCompleted ? 'Selesai' : 'Vaksinasi'}
      </button>

      {isOverdue && (
        <Button
          icon={<RetryIcon />}
          type="button"
          roundedClass="rounded-lg"
          onClick={() => onOpenSchedule?.(item)}
          label={`Jadwalkan ulang ${item.petName}`}
        />
      )}

      <Button
        icon={<HistoryIcon />}
        roundedClass="rounded-lg"
        onClick={() => onOpenHistory(item)}
        label={`History ${item.petName}`}
      />
      {canSendReminder && (
        <Button
        label="jadwalkan"
        icon={<SendIcon />}
        roundedClass="rounded-lg"
        color="bg-accent-blue-400"
        hoverColor="hover:bg-accent-blue-500"
        onClick={() => onOpenSend?.(item)}
      />
      )}
      {!isCompleted && (
        <Button
        className="p-2 rounded-lg bg-accent-yellow-300 hover:bg-accent-yellow-400"
        icon={<PenIcon />}
        onClick={() => onOpenEdit?.(item)}
      />
      )}
      

      

      <Button
        icon={<TrashIcon />}
        roundedClass="rounded-lg"
        color="bg-accent-red-300"
        hoverColor="hover:bg-accent-red-400"
        onClick={() => onDelete(item)}
        label={`Hapus ${item.petName}`}
      />
    </div>
  );
};

export default ReminderActionButtons;