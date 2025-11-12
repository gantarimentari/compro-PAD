"use client";

import HeaderDashboard from "@ds/dashboard/HeaderDashboard";
import Sidebar from "@ds/dashboard/Sidebar";
import ManagemenMedia from "@ds/dashboard/components/ManagemenMedia";

export default function DashboardAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed */}
      <Sidebar />
      
      {/* Main Content Area - Flexible */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Fixed */}
        <HeaderDashboard />
        
        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          <ManagemenMedia />
        </main>
      </div>
    </div>
  );
}

