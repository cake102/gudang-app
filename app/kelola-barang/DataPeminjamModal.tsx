// app/kelola-barang/DataPeminjamModal.tsx
'use client';

import { HiX } from 'react-icons/hi';

interface DataPeminjamModalProps {
  open: boolean;
  onClose: () => void;
  barangId: string | null;
}

interface Peminjaman {
  username: string;
  barangId: string;
  namaBarang: string;
  kuantiti: number;
  tanggal: string;
  status: string;
}

export default function DataPeminjamModal({ open, onClose, barangId }: DataPeminjamModalProps) {
  if (!open || !barangId) return null;

  let peminjaman: Peminjaman[] = [];
  if (typeof window !== 'undefined') {
    peminjaman = JSON.parse(localStorage.getItem('peminjaman') || '[]');
  }
  const dataPeminjam = peminjaman.filter(
    (p) => p.barangId === barangId && p.status === 'dipinjam'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-md animate-modalOpen">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 pt-12 border border-blue-200 relative">
          {/* Tombol Close pojok kanan atas */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
            aria-label="Tutup"
            type="button"
          >
            <HiX className="w-7 h-7" />
          </button>
          <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center drop-shadow">Data Peminjam Barang</h2>
          {dataPeminjam.length === 0 ? (
            <div className="text-gray-500 text-center py-8">Belum ada peminjam aktif untuk barang ini.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full rounded-xl">
                <thead>
                  <tr className="bg-blue-100/60 text-blue-700">
                    <th className="py-2 px-3 text-left">Username</th>
                    <th className="py-2 px-3 text-left">Kuantiti</th>
                    <th className="py-2 px-3 text-left">Tanggal Pinjam</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPeminjam.map((p, idx) => (
                    <tr key={idx} className="border-b border-blue-100 hover:bg-blue-50/40">
                      <td className="py-2 px-3">{p.username}</td>
                      <td className="py-2 px-3">{p.kuantiti}</td>
                      <td className="py-2 px-3">{p.tanggal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1"
            >
              <HiX className="w-5 h-5" />
              Tutup
            </button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes modalOpen {
          0% { transform: scale(0.95) translateY(40px); opacity: 0 }
          100% { transform: scale(1) translateY(0); opacity: 1 }
        }
        .animate-modalOpen {
          animation: modalOpen 0.35s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}
