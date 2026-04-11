import React from 'react';
import { WarningIcon, RetryIcon } from '@/components/icons';
import Button from '@/components/ui/Button';

export const ButtonAction = ({ item, onOpenDetail, onResend }) => {
  const isFailedToSent = item.status === 'Gagal';
  return (
    <div className="flex items-center gap-2">
    <Button
    icon={<WarningIcon/>}
    type="button"
    onClick={() => onOpenDetail?.(item)}
    roundedClass="rounded-lg"
    color="bg-accent-blue-400"
    hoverColor="hover:bg-accent-blue-500"
    focusColor="focus:bg-accent-blue-400 "
    />
    {isFailedToSent && (
      <Button
        icon={<RetryIcon color="#0081DD"/>}
        type="button"
        onClick={() => onResend?.(item)}
        roundedClass="rounded-lg"
        hoverColor="hover:bg-accent-neutral-500"
        focusColor="focus:bg-accent-neutral-400 "
        className='border-2 border-accent-blue-400 w-9 h-9'
      />
    )}
     </div>
    
   
  );
};