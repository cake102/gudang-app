// app/kelola-barang/PengembalianModal.tsx
'use client';

import { useState } from 'react';

interface PengembalianModalProps {
  open: boolean;
  onClose: () => void;
  barang: {
    id: string;
    nama: string;
    barcode: string;
  } | null;
  onKembali: (data: { username: string }) => void;
}

export default function PengembalianModal({ open, onClose, barang, onKembali }: PengembalianModalProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  if (!open || !barang) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError('Username wajib diisi.');
      return;
    }
    setError('');
    onKembali({ username });
    setUsername('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md animate-popup">
        <h2 className="text-xl font-bold mb-4 text-blue-700 text-center">Pengembalian Barang</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nama Barang</label>
            <div className="mt-1 font-semibold text-blue-900">{barang.nama}</div>
          </div>
          <div>
            <label className="block text-sm font-medium">Username Peminjam</label>
            <input
              type="text"
              className="mt-1 w-full border rounded px-3 py-2 bg-white/80 focus:ring-2 focus:ring-blue-300 outline-none"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              placeholder="Masukkan username peminjam"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex gap-2 justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
            >
              Kembalikan
            </button>
          </div>
        </form>
      </div>
      <style jsx global>{`
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
