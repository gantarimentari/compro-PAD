'use client';

import React from 'react';
import { CloseIcon } from '@ds/icons';

const BaseModal = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children, 
  maxWidth = 'max-w-lg',
  showCloseButton = true,
  overflowHidden = false
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className={`relative bg-white rounded-lg ${maxWidth} w-full max-h-[90vh] ${overflowHidden ? 'overflow-hidden' : 'overflow-y-auto'} shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description || showCloseButton) && (
          <div className="sticky top-0 bg-white pb-0 px-6 py-4 flex items-center justify-between z-10">
            {(title || description) && (
              <div>
                {title && (
                  <p className="text-h-7 font-bold text-accent-neutral-1000">{title}</p>
                )}
                {description && (
                  <p className="text-accent-neutral-800 text-body-2 mt-1">{description}</p>
                )}
              </div>
            )}
          
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default BaseModal;

