"use client";
import React from "react";
import { GaleryIcon, FileIcon, PromoIcon, PeopleIcon, DogIcon, PawIcon, CalendarIcon, SettingsIcon, DBHomeIcon,
  JarumSuntikIcon
} from "@ds/icons"; 
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { href: '/dashboard',                  icon: DBHomeIcon,     label: 'Home' },
    { href: '/dashboard/users',            icon: PeopleIcon,     label: 'Manajemen Pasien' },
    { href: '/dashboard/hewan',            icon: DogIcon,        label: 'Manajemen Hewan' },
    { href: '/dashboard/jenis-hewan',      icon: PawIcon,        label: 'Jenis Hewan' },
    { href: '/dashboard/reservasi',        icon: CalendarIcon,   label: 'Reservasi' },
    { href: '/dashboard/reminder-vaksinasi', icon: JarumSuntikIcon, label: 'Reminder Vaksinasi' },
    { href: '/dashboard/artikel',          icon: FileIcon,       label: 'Manajemen Artikel' },
    { href: '/dashboard/media',            icon: GaleryIcon,     label: 'Manajemen Media' },
    { href: '/dashboard/admin',            icon: PeopleIcon,     label: 'Manajemen Admin' },
    { href: '/dashboard/promo',            icon: PromoIcon,      label: 'Managemen Promo' },
    { href: '/dashboard/system',           icon: SettingsIcon,   label: 'System Info' },
  ];

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return(
    <aside className="sticky top-0 z-10 h-screen w-76 bg-white shadow-md p-6 flex-shrink-0 overflow-y-auto">
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
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-[20px] transition-colors 
                ${active 
                  ? 'bg-accent-blue-300 text-white' 
                  : 'text-accent-neutral-1000 hover:bg-accent-neutral-225 bg-white'
                }
              `}
            >
              <IconComponent 
                className="w-5 h-5 flex-shrink-0" 
                color={active ? "white" : "currentColor"}
              />
              <span className="text-body-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
