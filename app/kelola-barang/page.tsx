// app/kelola-barang/page.tsx
'use client';

import { useEffect, useState } from 'react';
import EditBarangModal from './EditBarangModal';
import PinjamBarangModal from './PinjamBarangModal';
import DataPeminjamModal from './DataPeminjamModal';
import PengembalianModal from './PengembalianModal';

interface Barang {
  id: string;
  nama: string;
  kuantiti: number;
  tanggal: string;
  gambar: string; // base64 url
  barcode: string;
}

export default function KelolaBarangPage() {
  const [barang, setBarang] = useState<Barang[]>([]);
  const [search, setSearch] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [barangEdit, setBarangEdit] = useState<Barang | null>(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showEditSuccess, setShowEditSuccess] = useState(false);

  // State untuk modal pinjam
  const [pinjamModalOpen, setPinjamModalOpen] = useState(false);
  const [barangPinjam, setBarangPinjam] = useState<Barang | null>(null);

  // State untuk modal data peminjam
  const [dataPeminjamOpen, setDataPeminjamOpen] = useState(false);
  const [barangIdPeminjam, setBarangIdPeminjam] = useState<string | null>(null);

  // State untuk modal pengembalian
  const [pengembalianModalOpen, setPengembalianModalOpen] = useState(false);
  const [barangKembali, setBarangKembali] = useState<Barang | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('barang');
    if (data) setBarang(JSON.parse(data));
  }, []);

  // Filter barang berdasarkan nama atau barcode (id)
  const filteredBarang = barang.filter(
    (b) =>
      b.nama.toLowerCase().includes(search.toLowerCase()) ||
      b.barcode.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (barang: Barang) => {
    setBarangEdit(barang);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (barangBaru: Barang) => {
    const newBarang = barang.map(b => b.id === barangBaru.id ? barangBaru : b);
    setBarang(newBarang);
    localStorage.setItem('barang', JSON.stringify(newBarang));
    setShowEditSuccess(true);
    setTimeout(() => setShowEditSuccess(false), 1500);
  };

  const handleDelete = (id: string) => {
    const newBarang = barang.filter(b => b.id !== id);
    setBarang(newBarang);
    localStorage.setItem('barang', JSON.stringify(newBarang));
    setShowDeleteSuccess(true);
    setTimeout(() => setShowDeleteSuccess(false), 1500);
  };

  // Pinjam barang
  const handlePinjam = (barang: Barang) => {
    setBarangPinjam(barang);
    setPinjamModalOpen(true);
  };

  const handleSavePinjam = (data: { username: string; kuantiti: number; barcode: string }) => {
    // Simpan data peminjaman ke localStorage
    const peminjaman = JSON.parse(localStorage.getItem('peminjaman') || '[]');
    peminjaman.push({
      ...data,
      barangId: barangPinjam?.id,
      namaBarang: barangPinjam?.nama,
      tanggal: new Date().toISOString().slice(0, 10),
      status: 'dipinjam',
    });
    localStorage.setItem('peminjaman', JSON.stringify(peminjaman));
    // Kurangi stok barang
    if (barangPinjam) {
      const newBarang = barang.map(b =>
        b.id === barangPinjam.id
          ? { ...b, kuantiti: b.kuantiti - data.kuantiti }
          : b
      );
      setBarang(newBarang);
      localStorage.setItem('barang', JSON.stringify(newBarang));
    }
  };

  // Data peminjam
  const handleShowDataPeminjam = (barangId: string) => {
    setBarangIdPeminjam(barangId);
    setDataPeminjamOpen(true);
  };

  // Pengembalian barang
  const handlePengembalian = (barang: Barang) => {
    setBarangKembali(barang);
    setPengembalianModalOpen(true);
  };

  const handleSavePengembalian = ({ username }: { username: string }) => {
    // Update status peminjaman di localStorage
    const peminjaman = JSON.parse(localStorage.getItem('peminjaman') || '[]');
    const now = new Date().toISOString().slice(0, 10);
    let updated = false;
    let jumlahKembali = 0;
    for (const p of peminjaman) {
      if (
        p.barangId === barangKembali?.id &&
        p.username === username &&
        p.status === 'dipinjam'
      ) {
        p.status = 'dikembalikan';
        p.tanggalKembali = now;
        jumlahKembali = p.kuantiti || 0;
        updated = true;
        break;
      }
    }
    localStorage.setItem('peminjaman', JSON.stringify(peminjaman));
    // Tambahkan stok barang kembali
    if (updated && barangKembali) {
      const barangList = JSON.parse(localStorage.getItem('barang') || '[]');
      for (const b of barangList) {
        if (b.id === barangKembali.id) {
          b.kuantiti = Number(b.kuantiti) + Number(jumlahKembali);
          break;
        }
      }
      localStorage.setItem('barang', JSON.stringify(barangList));
      setBarang(barangList);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-10 text-transparent bg-clip-text bg-blue-800 drop-shadow-lg tracking-tight text-center leading-[1.15]">
        Kelola Barang
      </h1>
      {/* Search Bar Modern */}
      <div className="mb-6 flex flex-col sm:flex-row gap-2 sm:items-center w-full max-w-2xl mx-auto">
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
            placeholder="Cari nama barang atau barcode..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full max-w-5xl flex flex-col gap-8 px-4">
        <div className="overflow-x-auto rounded-2xl shadow-xl border border-blue-200 bg-white/40 backdrop-blur-md">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-100/60 text-blue-700">
                <th className="py-2 px-3 text-left">Gambar</th>
                <th className="py-2 px-3 text-left">Nama</th>
                <th className="py-2 px-3 text-left">Barcode</th>
                <th className="py-2 px-3 text-left">Kuantiti</th>
                <th className="py-2 px-3 text-left">Tanggal</th>
                <th className="py-2 px-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredBarang.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    Tidak ada barang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredBarang.map((b) => (
                  <tr key={b.id} className="border-b border-blue-100 hover:bg-blue-50/40">
                    <td className="py-2 px-3">
                      <img
                        src={b.gambar || '/file.svg'}
                        alt={b.nama}
                        className="w-12 h-12 object-cover rounded border"
                      />
                    </td>
                    <td className="py-2 px-3">{b.nama}</td>
                    <td className="py-2 px-3 break-all">{b.barcode}</td>
                    <td className="py-2 px-3">{b.kuantiti}</td>
                    <td className="py-2 px-3">{b.tanggal}</td>
                    <td className="py-2 px-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition text-xs"
                          onClick={() => handleEdit(b)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs"
                          onClick={() => handlePinjam(b)}
                        >
                          Pinjam
                        </button>
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs"
                          onClick={() => handlePengembalian(b)}
                        >
                          Pengembalian
                        </button>
                        <button
                          className="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition text-xs"
                          onClick={() => handleShowDataPeminjam(b.id)}
                        >
                          Data Peminjam
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs flex items-center gap-1"
                          onClick={() => handleDelete(b.id)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <EditBarangModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        barang={barangEdit}
        onSave={handleSaveEdit}
      />
      <PinjamBarangModal
        open={pinjamModalOpen}
        onClose={() => setPinjamModalOpen(false)}
        barang={barangPinjam}
        onPinjam={handleSavePinjam}
      />
      <PengembalianModal
        open={pengembalianModalOpen}
        onClose={() => setPengembalianModalOpen(false)}
        barang={barangKembali}
        onKembali={handleSavePengembalian}
      />
      <DataPeminjamModal
        open={dataPeminjamOpen}
        onClose={() => setDataPeminjamOpen(false)}
        barangId={barangIdPeminjam}
      />

      {/* Popup animasi berhasil hapus */}
      {showDeleteSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center animate-popup">
            <svg
              className="w-20 h-20 text-red-500 animate-trash"
              viewBox="0 0 52 52"
            >
              <rect
                x="16"
                y="20"
                width="20"
                height="18"
                rx="2"
                fill="#f87171"
                className="trash-bin"
              />
              <rect
                x="20"
                y="12"
                width="12"
                height="8"
                rx="2"
                fill="#fca5a5"
                className="trash-lid"
              />
              <path
                d="M26 28v6"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                className="trash-line"
              />
              <path
                d="M30 28v6"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                className="trash-line"
              />
              <path
                d="M22 28v6"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                className="trash-line"
              />
            </svg>
            <div className="mt-4 text-lg font-semibold text-red-500 animate-fadeIn">
              Barang berhasil dihapus!
            </div>
          </div>
        </div>
      )}

      {/* Popup animasi berhasil edit */}
      {showEditSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center animate-popup">
            <svg
              className="w-20 h-20 text-green-500 animate-checkmark"
              viewBox="0 0 52 52"
            >
              <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
              />
              <path
                className="checkmark__check"
                fill="none"
                stroke="#22c55e"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27l7 7 16-16"
              />
            </svg>
            <div className="mt-4 text-lg font-semibold text-green-600 animate-fadeIn">
              Barang berhasil diupdate!
            </div>
          </div>
        </div>
      )}

      {/* Animasi global */}
      <style jsx global>{`
        @keyframes trashLid {
          0% { transform: rotate(0deg) translateY(0); }
          30% { transform: rotate(-25deg) translateY(-8px);}
          60% { transform: rotate(0deg) translateY(0);}
          100% { transform: rotate(0deg) translateY(0);}
        }
        .animate-trash .trash-lid {
          transform-origin: 26px 16px;
          animation: trashLid 1s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes trashBin {
          0% { transform: scaleY(1);}
          20% { transform: scaleY(0.9);}
          40% { transform: scaleY(1);}
          100% { transform: scaleY(1);}
        }
        .animate-trash .trash-bin {
          animation: trashBin 1s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes trashLine {
          0% { stroke-dasharray: 0, 12; }
          40% { stroke-dasharray: 12, 0; }
          100% { stroke-dasharray: 12, 0; }
        }
        .animate-trash .trash-line {
          stroke-dasharray: 0, 12;
          animation: trashLine 1s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes checkmark {
          0% {
            stroke-dashoffset: 48;
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-checkmark .checkmark__check {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: checkmark 0.7s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .animate-checkmark .checkmark__circle {
          stroke-dasharray: 160;
          stroke-dashoffset: 160;
          animation: checkmark 0.7s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s;
        }
        @keyframes popup {
          0% { transform: scale(0.8); opacity: 0 }
          100% { transform: scale(1); opacity: 1 }
        }
        .animate-popup {
          animation: popup 0.25s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}
