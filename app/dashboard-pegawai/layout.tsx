// app/pegawai/layout.tsx
import SidebarPegawai from '../components/SidebarPegawai';
import { SidebarProvider } from '../components/SidebarContext';


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarPegawai />
      <main className="transition-all duration-300 ml-0 sm:ml-56">
        {children}
      </main>
    </SidebarProvider>
  );
}
