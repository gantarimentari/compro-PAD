"use client";
import React from "react";
import { GaleryIcon, FileIcon, PromoIcon, PeopleIcon,DogIcon, PawIcon, CalendarIcon } from "@ds/icons"; 
import Link from "next/link";

export default function Sidebar({ activeMenu, setActiveMenu }){
  const menu = [
    {id: 'users', icon: PeopleIcon, label: 'Manajemen Pasien'},
    {id: 'hewan', icon: DogIcon, label: 'Manajemen Hewan'},
    {id: 'jenisHewan', icon: PawIcon, label: 'Jenis Hewan'},
    {id: 'reservasi', icon: CalendarIcon, label: 'Reservasi'},
    {id: 'artikel', icon: FileIcon, label: 'Manajemen Artikel'},
    {id: 'media', icon: GaleryIcon, label: 'Manajemen Media'},
    {id: 'admin', icon: PeopleIcon, label: 'Manajemen Admin'},
    {id: 'prommo', icon: PromoIcon, label: 'Managemen Promo'},
    {id: 'system', icon: PawIcon, label: 'System Info'},
    
    
    
    
  ];

  const handleMenuClick = (e, menuId) => {
    e.preventDefault();
    setActiveMenu(menuId);
  };

  return(
    <aside className="w-72 bg-white  shadow-md p-6 flex-shrink-0 overflow-y-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 ">
            <img
              className="h-14 w-auto"
              src="/logo.svg"
              alt="Company Logo"
            />
          </div>
          <p className="text-body-2 text-accent-blue-500 font-bold leading-tight">
            Praktik Dokter Hewan Fanina
          </p>
        </div>
      </div>
      
      <nav className="flex flex-col space-y-2">
        {menu.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeMenu === item.id;
          
          return (
            <button
              key={item.id}
              // href={item.href}
              onClick={(e) => handleMenuClick(e, item.id)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-[20px] transition-colors 
                ${isActive 
                  ? 'bg-accent-blue-300 text-white' 
                  : 'text-accent-neutral-1000 hover:bg-accent-neutral-225 bg-white'
                }
              `}
            >
              <IconComponent 
                className="w-5 h-5 flex-shrink-0" 
                color={isActive ? "white" : "currentColor"}
              />
              <span className="text-body-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}