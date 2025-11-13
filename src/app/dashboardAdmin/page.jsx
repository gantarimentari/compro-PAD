"use client";

import HeaderDashboard from "@ds/dashboard/HeaderDashboard";
import Sidebar from "@ds/dashboard/Sidebar";
import ManagemenArtikel from "@ds/dashboard/components/ManagemenArtikel";
import ManagemenMedia from "@ds/dashboard/components/ManagemenMedia";

export default function DashboardAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <HeaderDashboard />
        <main className="flex-1 overflow-y-auto p-6">
          <ManagemenArtikel />
          <ManagemenMedia />
        </main>
      </div>
    </div>
  );
}

