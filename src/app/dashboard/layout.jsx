import HeaderDashboard from "@/components/layouts/HeaderDashboard";
import Sidebar from "@/components/layouts/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <section  className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <HeaderDashboard />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </section>
  );
}
