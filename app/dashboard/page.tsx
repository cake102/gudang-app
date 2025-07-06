// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface Barang {
  id: string;
  nama: string;
  kuantiti: number;
  tanggal: string;
  gambar: string;
}

interface Peminjaman {
  username: string;
  kuantiti: number;
  barcode: string;
  barangId: string;
  tanggal?: string;
  status?: 'dipinjam' | 'dikembalikan';
}

export default function DashboardGudang() {
  const [jumlahBarang, setJumlahBarang] = useState(0);
  const [totalStok, setTotalStok] = useState(0);
  const [totalDipinjam, setTotalDipinjam] = useState(0);

  useEffect(() => {
    function updateData() {
      const dataBarang = localStorage.getItem('barang');
      let barang: Barang[] = [];
      if (dataBarang) {
        barang = JSON.parse(dataBarang);
        setJumlahBarang(barang.length);
        setTotalStok(
          barang.reduce((acc, b) => acc + Number(b.kuantiti ?? 0), 0)
        );
      } else {
        setJumlahBarang(0);
        setTotalStok(0);
      }

      const dataPeminjaman = localStorage.getItem('peminjaman');
      let peminjaman: Peminjaman[] = [];
      if (dataPeminjaman) {
        peminjaman = JSON.parse(dataPeminjaman);
        const total = peminjaman
          .filter((p) => !p.status || p.status === 'dipinjam')
          .reduce((acc, p) => acc + Number(p.kuantiti ?? 0), 0);
        setTotalDipinjam(total);
      } else {
        setTotalDipinjam(0);
      }
    }

    updateData();
    const interval = setInterval(updateData, 1000);
    window.addEventListener('storage', updateData);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', updateData);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fullscreen Background Image */}
      <img
        src="/hero-03.jpg"
        alt="Background"
        className="fixed inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0"
        style={{ backgroundColor: 'transparent' }}
      />
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] w-full">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-10 text-transparent bg-clip-text bg-blue-800 drop-shadow-lg tracking-tight text-center leading-[1.15]">
          Selamat Datang di <span className="whitespace-nowrap">Warehouse Insight</span>
        </h1>
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-8 px-4">
          {/* Card 1 */}
          <div className="group rounded-2xl shadow-xl p-8 flex flex-col items-center border border-blue-200 bg-white/40 backdrop-blur-md transition-all duration-300
            hover:-translate-y-2 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <div className="mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" />
                <path d="M8 12h8M12 8v8" stroke="currentColor" />
              </svg>
            </div>
            <span className="text-gray-500 mb-2 font-medium">Jumlah Jenis Barang</span>
            <span className="text-4xl font-extrabold text-blue-600 tracking-tight transition-all duration-300">{jumlahBarang}</span>
          </div>
          {/* Card 2 */}
          <div className="group rounded-2xl shadow-xl p-8 flex flex-col items-center border border-green-200 bg-white/40 backdrop-blur-md transition-all duration-300
            hover:-translate-y-2 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <div className="mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
              <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M4 17v-7a2 2 0 012-2h12a2 2 0 012 2v7" stroke="currentColor" />
                <rect x="9" y="13" width="6" height="4" rx="1" stroke="currentColor" />
              </svg>
            </div>
            <span className="text-gray-500 mb-2 font-medium">Total Stok di Gudang</span>
            <span className="text-4xl font-extrabold text-green-600 tracking-tight transition-all duration-300">{totalStok}</span>
          </div>
          {/* Card 3 */}
          <div className="group rounded-2xl shadow-xl p-8 flex flex-col items-center border border-red-200 bg-white/40 backdrop-blur-md transition-all duration-300
            hover:-translate-y-2 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <div className="mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M7 17V7a2 2 0 012-2h6a2 2 0 012 2v10" stroke="currentColor" />
                <rect x="9" y="13" width="6" height="4" rx="1" stroke="currentColor" />
              </svg>
            </div>
            <span className="text-gray-500 mb-2 font-medium">Barang yang Dipinjam</span>
            <span className="text-4xl font-extrabold text-red-600 tracking-tight transition-all duration-300">{totalDipinjam}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
