// app/dashboard/layout.tsx
'use client';

import Sidebar, { SidebarMenu } from '../components/Sidebar';
import { SidebarProvider, useSidebar } from '../components/SidebarContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const menuGudang: SidebarMenu[] = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/tambah-akun', label: 'Tambah Akun' },
    { href: '/kelola-barang', label: 'Kelola Barang' },
    { href: '/tambah-barang', label: 'Tambah Barang' },
  ];

  return (
    <SidebarProvider>
      <DashboardLayoutContent menu={menuGudang}>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}

// Pisahkan agar bisa pakai useSidebar (client hook)
function DashboardLayoutContent({ menu, children }: { menu: SidebarMenu[]; children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <div className="min-h-screen">
      <Sidebar menu={menu} />
      <main
        className={`
          transition-all duration-300
          ${open ? 'ml-56' : 'ml-0'}
          p-4
          flex flex-col items-center
        `}
      >
        {children}
      </main>
    </div>
  );
}
