"use client";
import React from 'react';
import { SearchIcon } from '@/components/icons';


export default function SearchBar({ 
  placeholderText, 
  value, 
  onChange 
}) {
  return (
      <div className="relative max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="h-5 w-5 text-accent-neutral-800" />
          </div>
          <input
              type="search"
              placeholder={placeholderText}
              value={value}
              onChange={onChange}
              className="w-full pl-10 text-body-2 text-accent-neutral-800 pr-4 py-2 
                         bg-accent-neutral-200 rounded-xl transition duration-150"
          />
      </div>
  );
}
