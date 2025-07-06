// app/kelola-barang/EditBarangModal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { HiX, HiOutlinePrinter, HiOutlineRefresh } from 'react-icons/hi';

interface EditBarangModalProps {
  open: boolean;
  onClose: () => void;
  barang: {
    id: string;
    nama: string;
    kuantiti: number;
    tanggal: string;
    gambar: string;
    barcode: string;
  } | null;
  onSave: (barang: any) => void;
}

export default function EditBarangModal({ open, onClose, barang, onSave }: EditBarangModalProps) {
  const [nama, setNama] = useState('');
  const [kuantiti, setKuantiti] = useState(1);
  const [tanggal, setTanggal] = useState('');
  const [gambar, setGambar] = useState('');
  const [barcode, setBarcode] = useState('');
  const [showBarcode, setShowBarcode] = useState(false);
  const [barcodeImg, setBarcodeImg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (barang) {
      setNama(barang.nama);
      setKuantiti(barang.kuantiti);
      setTanggal(barang.tanggal);
      setGambar(barang.gambar);
      setBarcode(barang.barcode);
      setShowBarcode(false);
      setBarcodeImg(null);
    }
  }, [barang, open]);

  // Generate barcode
  const handleGenerateBarcode = () => {
    const code = `${Date.now()}-${nama || 'BARANG'}`;
    setBarcode(code);
    setShowBarcode(false);
    setBarcodeImg(null);
  };

  // Render barcode ke canvas dan ambil dataURL untuk print
  useEffect(() => {
    if (showBarcode && barcode && canvasRef.current) {
      JsBarcode(canvasRef.current, barcode, {
        format: "CODE128",
        width: 2,
        height: 60,
        displayValue: true,
      });
      setTimeout(() => {
        const dataUrl = canvasRef.current?.toDataURL();
        if (dataUrl) setBarcodeImg(dataUrl);
      }, 100);
    }
  }, [showBarcode, barcode]);

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
    onSave({
      ...barang,
      nama,
      kuantiti,
      tanggal,
      gambar,
      barcode,
    });
    onClose();
  };

  const handleGambar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setGambar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  if (!open || !barang) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Popup Card */}
      <div className="relative w-full max-w-md animate-modalOpen">
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 pt-12 border border-blue-200 relative">
          {/* Tombol Close pojok kanan atas */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
            aria-label="Tutup"
            type="button"
          >
            <HiX className="w-7 h-7" />
          </button>
          <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center drop-shadow">Edit Barang</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium">Gambar Barang</label>
              <input type="file" accept="image/*" onChange={handleGambar} className="mt-1" />
              {gambar && (
                <img src={gambar} alt="Preview" className="w-20 h-20 mt-2 object-cover rounded border" />
              )}
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
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition flex items-center gap-1"
                  onClick={handleGenerateBarcode}
                  title="Generate Barcode"
                >
                  <HiOutlineRefresh className="w-5 h-5" />
                  <span className="hidden sm:inline">Generate</span>
                </button>
                <button
                  type="button"
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition flex items-center gap-1"
                  onClick={() => setShowBarcode(true)}
                  title="Print Barcode"
                >
                  <HiOutlinePrinter className="w-5 h-5" />
                  <span className="hidden sm:inline">Print</span>
                </button>
              </div>
            </div>
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
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
        {/* Popup preview barcode untuk print */}
        {showBarcode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center animate-popup">
              <canvas ref={canvasRef} style={{ display: 'block', margin: 'auto' }} />
              <div className="text-center mt-2 text-xs text-gray-500 break-all">{barcode}</div>
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center gap-1"
                  disabled={!barcodeImg}
                >
                  <HiOutlinePrinter className="w-5 h-5" />
                  Print Barcode
                </button>
                <button
                  type="button"
                  onClick={() => setShowBarcode(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition flex items-center gap-1"
                >
                  <HiX className="w-5 h-5" />
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes popup {
          0% { transform: scale(0.8); opacity: 0 }
          100% { transform: scale(1); opacity: 1 }
        }
        .animate-popup {
          animation: popup 0.25s cubic-bezier(0.4,0,0.2,1);
        }
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
