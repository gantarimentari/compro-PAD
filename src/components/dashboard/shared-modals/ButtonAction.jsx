import React from 'react';
import { WarningIcon, TrashIcon, PenIcon, PrinterIcon } from '@/components/icons';
import Button from '@/components/ui/Button';

export const DetailButton = ({ item, onOpenDetail }) => {
  return (
    <Button
      label="detail"
      roundedClass="rounded-lg"
      color="bg-accent-blue-300"
      hoverColor="hover:bg-accent-blue-400"
      icon={<WarningIcon />}
      onClick={() => onOpenDetail?.(item)}
    />
  )
}

export const EditButton = ({ item, onEdit }) => {
  return (
    <Button
      label="edit"
      roundedClass="rounded-lg"
      color="bg-accent-yellow-300"
      hoverColor="hover:bg-accent-yellow-400"
      icon={<PenIcon />}
      onClick={() => onEdit?.(item)}
    />
  )
}
export const DeleteButton = ({ item, onDelete }) => {
  return (
    <Button
      label="delete"
      roundedClass="rounded-lg"
      color="bg-accent-red-300"
      hoverColor="hover:bg-accent-red-400"
      icon={<TrashIcon />}
      onClick={() => onDelete?.(item)}
    />
  )
}
export const PrintButton = ({ item, onDownload }) => {
  return (
    <Button
      textColor='text-red'
      label='download'
      roundedClass="rounded-lg"
      onClick={() => onDownload?.(item)}
      icon={<PrinterIcon color='#000000' />}
    />
  )
}

export const TableActions = ({
  item,
  onEdit,
  onDelete,
  onDetail,
  onPrint,
  extraActions,

}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {extraActions}
      {onEdit && <EditButton item={item} onEdit={onEdit} />}
      {onDelete && <DeleteButton item={item} onDelete={onDelete} />}
      {onDetail && <DetailButton item={item} onOpenDetail={onDetail} />}
      {onPrint && <PrintButton item={item} onDownload={onPrint} />}
    </div>
  );
};
