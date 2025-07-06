// app/tambah-barang/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import PrintBarcode from '../components/PrintBarcode';

interface Barang {
  id: string;
  nama: string;
  kuantiti: number;
  tanggal: string;
  gambar: string; // base64 url
  barcode: string;
}

const BARANG_PER_PAGE = 5;

export default function TambahBarangPage() {
  const [barang, setBarang] = useState<Barang[]>([]);
  const [page, setPage] = useState(1);

  const [nama, setNama] = useState('');
  const [kuantiti, setKuantiti] = useState(1);
  const [tanggal, setTanggal] = useState('');
  const [gambar, setGambar] = useState('');
  const [barcode, setBarcode] = useState('');

  const [showBarcode, setShowBarcode] = useState(false);
  const [barcodeImg, setBarcodeImg] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const barcodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = localStorage.getItem('barang');
    if (data) setBarang(JSON.parse(data));
  }, []);

  const totalPage = Math.ceil(barang.length / BARANG_PER_PAGE);
  const barangPage = barang.slice((page - 1) * BARANG_PER_PAGE, page * BARANG_PER_PAGE);

  const handleGambar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setGambar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerateBarcode = () => {
    const code = `${Date.now()}-${nama || 'BARANG'}`;
    setBarcode(code);
    setShowBarcode(true);
    setBarcodeImg(null); // reset img
  };

  // Print barcode as image
  const handlePrint = () => {
    if (!barcodeImg) return;
    const printWindow = window.open('', '', 'height=400,width=600');
    if (!printWindow) return;
    printWindow.document.write('<html><head><title>Print Barcode</title>');
    printWindow.document.write('<style>body{display:flex;justify-content:center;align-items:center;height:100vh;background:#fff;} img{display:block;margin:auto;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(`<div style="display:flex;flex-direction:column;align-items:center;">`);
    printWindow.document.write(`<img src="${barcodeImg}" alt="barcode" />`);
    printWindow.document.write(`<div style="text-align:center;margin-top:8px;font-size:12px;color:#6b7280;word-break:break-all;">${barcode}</div>`);
    printWindow.document.write(`</div>`);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !kuantiti || !tanggal || !barcode) {
      alert('Semua kolom wajib diisi dan barcode harus digenerate!');
      return;
    }
    const barangBaru: Barang = {
      id: Date.now().toString(),
      nama,
      kuantiti,
      tanggal,
      gambar,
      barcode,
    };
    const newBarang = [barangBaru, ...barang];
    setBarang(newBarang);
    localStorage.setItem('barang', JSON.stringify(newBarang));
    setNama('');
    setKuantiti(1);
    setTanggal('');
    setGambar('');
    setBarcode('');
    setShowBarcode(false);
    setBarcodeImg(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 min-h-[80vh] w-full items-center justify-center">
      {/* Kontainer Kiri: List Barang */}
      <div className="flex-1 max-w-2xl rounded-2xl shadow-xl p-6 border border-blue-200 bg-white/40 backdrop-blur-md">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Daftar Barang di Gudang</h2>
        <div className="space-y-4">
          {barangPage.length === 0 && <div className="text-gray-400">Belum ada barang.</div>}
          {barangPage.map((b) => (
            <div key={b.id} className="flex items-center gap-4 border-b border-blue-100 pb-2">
              <img
                src={b.gambar || '/file.svg'}
                alt={b.nama}
                className="w-16 h-16 object-cover rounded border"
              />
              <div className="flex-1">
                <div className="font-semibold">{b.nama}</div>
                <div className="text-sm text-gray-500">Kuantiti: {b.kuantiti}</div>
                <div className="text-xs text-gray-400">Ditambahkan: {b.tanggal}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        {totalPage > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPage }).map((_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Kontainer Kanan: Form Tambah Barang */}
      <div className="w-full md:max-w-sm rounded-2xl shadow-xl p-6 border border-green-200 bg-white/40 backdrop-blur-md self-start">
        <h2 className="text-xl font-bold mb-4 text-green-700">Tambah Barang Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Gambar Barang</label>
            <input type="file" accept="image/*" onChange={handleGambar} className="mt-1" />
            {gambar && (
              <img src={gambar} alt="Preview" className="w-20 h-20 mt-2 object-cover rounded border" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Nama Barang</label>
            <input
              type="text"
              className="mt-1 w-full border rounded px-3 py-2 bg-white/80 focus:ring-2 focus:ring-blue-300 outline-none"
              value={nama}
              onChange={e => setNama(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Kuantiti</label>
            <input
              type="number"
              className="mt-1 w-full border rounded px-3 py-2 bg-white/80 focus:ring-2 focus:ring-blue-300 outline-none"
              value={kuantiti}
              min={1}
              onChange={e => setKuantiti(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Tanggal Ditambahkan</label>
            <input
              type="date"
              className="mt-1 w-full border rounded px-3 py-2 bg-white/80 focus:ring-2 focus:ring-blue-300 outline-none"
              value={tanggal}
              onChange={e => setTanggal(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Barcode</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                className="mt-1 w-full border rounded px-3 py-2 bg-white/80 focus:ring-2 focus:ring-blue-300 outline-none"
                value={barcode}
                readOnly
                placeholder="Klik Generate"
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                onClick={handleGenerateBarcode}
              >
                Generate
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Tambah Barang
          </button>
        </form>
      </div>

      {/* Popup Barcode */}
      {showBarcode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
          <div
            className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center animate-popup"
            style={{ minWidth: 320 }}
          >
            {/* Bagian yang akan di-print */}
            <div ref={barcodeRef}>
              <PrintBarcode
                value={barcode || '-'}
                onImageReady={setBarcodeImg}
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={handlePrint}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                disabled={!barcodeImg}
              >
                Print Barcode
              </button>
              <button
                type="button"
                onClick={() => setShowBarcode(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Berhasil */}
      {showSuccess && (
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
              Barang berhasil ditambahkan!
            </div>
          </div>
        </div>
      )}

      {/* Animasi global */}
      <style jsx global>{`
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
