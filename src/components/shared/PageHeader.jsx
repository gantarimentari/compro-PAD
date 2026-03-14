"use client";
import React from 'react';
import { AddIcon } from '@/components/icons';
import Button from '@/components/ui/Button';

export default function PageHeader({ title, description, onAddClick, addButtonText }) {
  return (
      <div className="flex justify-between items-center">
          <div>
              <h1 className="text-h-7 font-bold text-accent-neutral-1000">{title}</h1>
              <p className="text-body-2 text-accent-neutral-800">{description}</p>
          </div>
          {/* {actionButton && actionButton} */}
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
  );
}