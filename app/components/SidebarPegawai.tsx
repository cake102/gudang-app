// app/components/SidebarPegawai.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HiOutlineHome, HiOutlineClipboardList, HiOutlineLogout, HiMenuAlt2, HiX } from 'react-icons/hi';
import { useSidebar } from './SidebarContext';
import { useEffect, useState } from 'react';

const menu = [
  { href: '/dashboard-pegawai', label: 'Dashboard', icon: <HiOutlineHome className="w-6 h-6" /> },
  { href: '/dashboard-pegawai/cek-barang', label: 'Cek Ketersediaan Barang', icon: <HiOutlineClipboardList className="w-6 h-6" /> },
];

export default function SidebarPegawai() {
  const pathname = usePathname();
  const router = useRouter();
  const { open, setOpen } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsMobile(true);
        setOpen(false);
      } else {
        setIsMobile(false);
        setOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    router.replace('/login');
  };

  return (
    <>
      {/* Hamburger Button (Mobile Only) */}
      {isMobile && !open && (
        <button
          className="fixed top-4 left-4 z-50 bg-white/60 rounded-full p-2 shadow-lg backdrop-blur-md border border-blue-900/10"
          onClick={() => setOpen(true)}
          aria-label="Buka Sidebar"
        >
          <HiMenuAlt2 className="w-7 h-7 text-blue-900" />
        </button>
      )}

      {/* Overlay (Mobile Only, saat sidebar open) */}
      {isMobile && open && (
        <div
          className="fixed inset-0 left-56 z-40 bg-black/30 transition-all duration-300"
          onClick={() => setOpen(false)}
          aria-label="Tutup Sidebar"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-56 transition-transform duration-300
          bg-gradient-to-b from-blue-900/20 via-green-900/20 to-blue-800/20 bg-white/40
          backdrop-blur-xl border-r border-blue-900/10 shadow-xl
          flex flex-col items-center py-8
          ${isMobile ? (open ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        `}
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
          WebkitBackdropFilter: 'blur(16px)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Close Button (Mobile Only) */}
        {isMobile && open && (
          <button
            className="absolute top-4 right-4 z-50 bg-white/60 rounded-full p-2 shadow border border-blue-900/10"
            onClick={() => setOpen(false)}
            aria-label="Tutup Sidebar"
          >
            <HiX className="w-6 h-6 text-blue-900" />
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center justify-center mb-10 w-12 h-12">
          <img
            src="/logo-tgi.png"
            alt="Logo TGI"
            className="w-12 h-12 object-contain"
          />
        </div>
        <nav className="w-full">
          <ul className="flex flex-col gap-3">
            {menu.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
                    ${pathname === item.href
                      ? 'bg-gradient-to-r from-blue-700/10 via-green-700/10 to-blue-800/10 text-blue-900 font-bold shadow'
                      : 'text-blue-900 hover:bg-gradient-to-r hover:from-blue-800/10 hover:via-green-800/10 hover:to-blue-900/10 hover:text-green-900'}
                    justify-start
                    group
                  `}
                  onClick={() => { if (isMobile) setOpen(false); }}
                >
                  <span className="text-xl flex-shrink-0">
                    {item.icon}
                  </span>
                  <span className="transition-all duration-200 opacity-100 ml-1 whitespace-nowrap truncate max-w-[140px]">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Footer: User info dan Logout */}
        <div className="mt-auto mb-2 w-full flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/30 border border-blue-900/10 backdrop-blur">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-800/20 to-green-800/20 flex items-center justify-center text-blue-900 font-bold">U</div>
            <span className="text-sm text-blue-900 font-medium">Pegawai</span>
          </div>
          {/* Tombol Logout Modern */}
          <button
            onClick={handleLogout}
            className={`
              group/logout relative flex items-center justify-center
              w-full px-4 py-2
              rounded-full transition-all duration-200
              bg-gradient-to-br from-green-700/20 to-blue-800/20
              hover:from-green-600/30 hover:to-blue-700/30
              shadow-lg
              focus:outline-none
              overflow-hidden
            `}
          >
            <span className="flex items-center justify-center">
              <HiOutlineLogout className="w-6 h-6 text-blue-900 group-hover/logout:scale-110 transition-transform duration-200" />
              <span className="ml-2 text-blue-900 font-semibold text-sm transition-all duration-200 opacity-100">
                Logout
              </span>
            </span>
            {/* Ripple effect on click */}
            <span className="absolute inset-0 rounded-full pointer-events-none group-active/logout:animate-logoutRipple"></span>
            <style jsx global>{`
              @keyframes logoutRipple {
                0% { background: rgba(31,38,135,0.10); opacity: 1; }
                100% { background: rgba(31,38,135,0); opacity: 0; }
              }
              .group-active\\:animate-logoutRipple:active {
                animation: logoutRipple 0.5s;
              }
            `}</style>
          </button>
        </div>
      </aside>
    </>
  );
}
