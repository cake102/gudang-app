// app/pegawai/cek-barang/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface Barang {
  id: string;
  nama: string;
  kuantiti: number;
  tanggal: string;
  gambar: string;
}

export default function CekBarangPegawai() {
  const [barang, setBarang] = useState<Barang[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const dataBarang = localStorage.getItem('barang');
    if (dataBarang) setBarang(JSON.parse(dataBarang));
  }, []);

  const filteredBarang = barang.filter(
    (b) =>
      b.nama.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4 bg-transparent">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-blue-900 text-center drop-shadow">
        Cek Ketersediaan Barang
      </h1>
      {/* Search Bar Modern */}
      <div className="mb-8 w-full max-w-lg">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400 pointer-events-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" />
              <path d="M21 21l-2-2" stroke="currentColor" />
            </svg>
          </span>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full rounded-full border border-blue-200 bg-white/60 shadow focus:outline-none focus:ring-2 focus:ring-blue-300 transition placeholder:text-blue-300"
            placeholder="Cari nama barang atau ID barcode..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full max-w-lg flex flex-col gap-4">
        {filteredBarang.length === 0 ? (
          <div className="rounded-xl bg-white/70 shadow p-6 text-center text-gray-400">
            Tidak ada data barang.
          </div>
        ) : (
          filteredBarang.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg p-5 flex items-center gap-4 border border-blue-100 hover:shadow-xl transition"
            >
              <img
                src={b.gambar || '/file.svg'}
                alt={b.nama}
                className="w-14 h-14 object-cover rounded-lg border"
              />
              <div className="flex-1">
                <div className="font-bold text-blue-900 text-lg">{b.nama}</div>
                <div className="text-xs text-gray-500">ID: {b.id}</div>
                <div className="text-xs text-gray-400">Ditambahkan: {b.tanggal}</div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-base font-semibold ${b.kuantiti === 0 ? 'text-red-600' : 'text-green-700'}`}>
                  Stok: {b.kuantiti}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
