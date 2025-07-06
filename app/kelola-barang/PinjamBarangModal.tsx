// app/kelola-barang/PinjamBarangModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { HiX, HiOutlineCheckCircle } from 'react-icons/hi';

interface Pegawai {
  username: string;
  role: string;
}

interface PinjamBarangModalProps {
  open: boolean;
  onClose: () => void;
  barang: {
    id: string;
    nama: string;
    kuantiti: number;
    barcode: string;
  } | null;
  onPinjam: (data: { username: string; kuantiti: number; barcode: string }) => void;
}

export default function PinjamBarangModal({ open, onClose, barang, onPinjam }: PinjamBarangModalProps) {
  const [username, setUsername] = useState('');
  const [kuantiti, setKuantiti] = useState(1);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Ambil data akun pegawai dari localStorage
    const data = localStorage.getItem('akun');
    if (data) {
      const akun: Pegawai[] = JSON.parse(data);
      setPegawaiList(akun.filter(a => a.role === 'pegawai'));
    }
  }, []);

  useEffect(() => {
    if (barang) {
      setKuantiti(1);
      setBarcodeInput('');
      setError('');
    }
  }, [barang, open]);

  if (!open || !barang) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError('Username peminjam wajib diisi.');
      return;
    }
    if (kuantiti < 1 || kuantiti > barang.kuantiti) {
      setError('Kuantiti tidak valid.');
      return;
    }
    if (barcodeInput !== barang.barcode) {
      setError('Barcode tidak cocok dengan barang.');
      return;
    }
    setError('');
    onPinjam({ username, kuantiti, barcode: barcodeInput });
    onClose();
  };

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
          <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center drop-shadow">Pinjam Barang</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Username Pegawai</label>
              <select
                className="mt-1 w-full border rounded px-3 py-2 bg-white/80 focus:ring-2 focus:ring-blue-300 outline-none"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              >
                <option value="">Pilih username</option>
                {pegawaiList.map((p) => (
                  <option key={p.username} value={p.username}>
                    {p.username}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Kuantiti Peminjaman</label>
              <input
                type="number"
                className="mt-1 w-full border rounded px-3 py-2 bg-white/80 focus:ring-2 focus:ring-blue-300 outline-none"
                value={kuantiti}
                min={1}
                max={barang.kuantiti}
                onChange={e => setKuantiti(Number(e.target.value))}
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                Stok tersedia: {barang.kuantiti}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Scan/Isi Barcode Barang</label>
              <input
                type="text"
                className="mt-1 w-full border rounded px-3 py-2 bg-white/80 focus:ring-2 focus:ring-blue-300 outline-none"
                value={barcodeInput}
                onChange={e => setBarcodeInput(e.target.value)}
                required
                placeholder="Scan barcode barang"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <div className="flex gap-2 justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition flex items-center gap-1"
              >
                <HiX className="w-5 h-5" />
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1"
              >
                <HiOutlineCheckCircle className="w-5 h-5" />
                Pinjam
              </button>
            </div>
          </form>
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
