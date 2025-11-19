"use client";

import { useState } from "react";
import HeaderDashboard from "@ds/dashboard/HeaderDashboard";
import Sidebar from "@ds/dashboard/Sidebar";
import ManagemenArtikel from "@ds/dashboard/components/ManagemenArtikel";
import ManagemenMedia from "@ds/dashboard/components/ManagemenMedia";
import ManagementPasien from "@ds/dashboard/components/ManagementPasien";
import ManagementHewan from "@ds/dashboard/components/ManagementHewan";
import JenisHewan from "@ds/dashboard/components/JenisHewan";
import Reservasi from "@ds/dashboard/components/Reservasi";

export default function DashboardAdminPage() {
  const [activeMenu, setActiveMenu] = useState('reservasi');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex-1 flex flex-col min-w-0">
        <HeaderDashboard />
        <main className="flex-1 overflow-y-auto p-6">
          {activeMenu === 'users' && <ManagementPasien />}
          {activeMenu === 'hewan' && <ManagementHewan />}  
          {activeMenu === 'jenisHewan' && <JenisHewan />}
          {activeMenu === 'artikel' && <ManagemenArtikel />}
          {activeMenu === 'media' && <ManagemenMedia />}
          {activeMenu === 'pasien' && <ManagementPasien />}
          {activeMenu === 'reservasi' && <Reservasi />}
        
          
        </main>
      </div>
    </div>
  );
}

