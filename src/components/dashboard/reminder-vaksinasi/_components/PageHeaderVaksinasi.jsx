"use client";
import React from 'react';
import { AddIcon, SendIcon } from '@/components/icons';
import Button from '@/components/ui/Button';

export default function PageHeader({ title, description, onAddClick, addButtonText, handleOpenWhatsApp, unsendCount }) {
  return (
      <div className="flex justify-between items-center">
          <div>
              <h1 className="text-h-7 font-bold text-accent-neutral-1000">{title}</h1>
              <p className="text-body-2 text-accent-neutral-800">{description}</p>
          </div>
          {/* {actionButton && actionButton} */}
          <div className="flex items-center gap-3">
            <Button
                        onClick={handleOpenWhatsApp} 
                        icon={<SendIcon className="h-4 w-4" color='#0081DD' />} 
                        iconPosition="left"
                        roundedClass="rounded-md"
                        // color="#0081DD" 
                        hoverColor="hover:bg-accent-blue-500 hover:text-white"
                        focusColor="focus:bg-accent-blue-400"
                        label="kirim semua"
                        textColor="text-accent-blue-400"
                        textSize="text-body-2 font-semibold"
                        className='border-2 border-accent-blue-400'
                      >
                        Kirim Semua Reminder ({unsendCount})
                      </Button>
          {onAddClick && addButtonText && (
            <Button 
              icon={<AddIcon />} 
              color="bg-accent-blue-400" 
              hoverColor="hover:bg-accent-blue-500"
              focusColor="focus:bg-accent-blue-300"
              roundedClass="rounded-lg"
              onClick={onAddClick}
            >
              {addButtonText}
            </Button>
          )}
          </div>
          
      </div>
  );
}