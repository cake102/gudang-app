// app/pegawai/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface Peminjaman {
  username: string;
  kuantiti: number;
  barcode: string;
  barangId: string;
  tanggal?: string;
  status?: 'dipinjam' | 'dikembalikan';
  namaBarang?: string;
}

interface Barang {
  id: string;
  nama: string;
  kuantiti: number;
  tanggal: string;
  gambar: string;
}

export default function DashboardPegawai() {
  const [barangDipinjam, setBarangDipinjam] = useState<Peminjaman[]>([]);
  const [today, setToday] = useState('');

  useEffect(() => {
    // Tanggal hari ini
    const now = new Date();
    setToday(now.toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }));

    // Ambil username login dari localStorage
    const username = localStorage.getItem('username');
    const dataPeminjaman = localStorage.getItem('peminjaman');
    const dataBarang = localStorage.getItem('barang');
    let peminjaman: Peminjaman[] = [];
    let barang: Barang[] = [];
    if (dataPeminjaman) peminjaman = JSON.parse(dataPeminjaman);
    if (dataBarang) barang = JSON.parse(dataBarang);

    // Filter barang yang dipinjam oleh user ini dan belum dikembalikan
    const dipinjam = peminjaman
      .filter(p => p.username === username && (!p.status || p.status === 'dipinjam'))
      .map(p => ({
        ...p,
        namaBarang: barang.find(b => b.id === p.barangId)?.nama || 'Barang Tidak Diketahui'
      }));

    setBarangDipinjam(dipinjam);
  }, []);

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-start py-10 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-blue-900 text-center">Dashboard Pegawai</h1>
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Kontainer Tanggal */}
        <div className="rounded-xl bg-white/70 shadow p-5 flex flex-col items-center">
          <span className="text-gray-500 text-sm mb-1">Tanggal Hari Ini</span>
          <span className="text-lg font-semibold text-blue-800">{today}</span>
        </div>
        {/* Kontainer Barang Dipinjam */}
        <div className="rounded-xl bg-white/70 shadow p-5">
          <span className="text-gray-500 text-sm mb-2 block">Barang yang Sedang Dipinjam</span>
          {barangDipinjam.length === 0 ? (
            <span className="text-gray-400 text-center block">Tidak ada barang yang sedang dipinjam.</span>
          ) : (
            <ul className="space-y-2">
              {barangDipinjam.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-b-0">
                  <span className="font-medium text-blue-900">{item.namaBarang}</span>
                  <span className="text-sm text-gray-600">x{item.kuantiti}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
