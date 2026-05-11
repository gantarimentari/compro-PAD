import React from 'react';
import { WarningIcon, TrashIcon, PenIcon } from '@/components/icons';
import Button from '@/components/ui/Button';
export const ButtonAction = ({ item, onOpenDetail, onEdit, onDelete }) => {
  return (
    <div className='flex items-center gap-2'>
      <Button
        label="edit"
        roundedClass="rounded-lg"
        color="bg-accent-yellow-300"
        hoverColor="hover:bg-accent-yellow-400"
        icon={<PenIcon />}
        onClick={() => onEdit?.(item)}
      />
      <Button
        label="delete"
        roundedClass="rounded-lg"
        color="bg-accent-red-300"
        hoverColor="hover:bg-accent-red-400"
        icon={<TrashIcon />}
        onClick={() => onDelete?.(item)}
      />
      <Button
        label="detail"
        roundedClass="rounded-lg"
        color="bg-accent-blue-300"
        hoverColor="hover:bg-accent-blue-400"
        icon={<WarningIcon />}
        onClick={() => onOpenDetail?.(item)}
      />
    </div>
  )};