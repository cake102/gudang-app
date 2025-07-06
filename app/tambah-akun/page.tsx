// app/tambah-akun/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface Akun {
  username: string;
  password: string;
  daerah: string;
  role: string; // 'pegawai' atau 'gudang'
}

function generatePassword(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

export default function TambahAkunPage() {
  const [akun, setAkun] = useState<Akun[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [daerah, setDaerah] = useState('');
  const [role, setRole] = useState('pegawai');
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Untuk animasi berhasil tambah/edit/hapus
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('akun');
    if (data) setAkun(JSON.parse(data));
  }, []);

  const handleGeneratePassword = () => {
    setPassword(generatePassword());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !daerah || !role) return;
    if (editIndex !== null) {
      // Edit mode
      const newAkun = [...akun];
      newAkun[editIndex] = { ...newAkun[editIndex], username, password, daerah, role };
      setAkun(newAkun);
      localStorage.setItem('akun', JSON.stringify(newAkun));
      setShowSuccess('Akun berhasil diupdate!');
    } else {
      // Tambah baru
      const newAkun = [
        ...akun,
        { username, password, daerah, role }
      ];
      setAkun(newAkun);
      localStorage.setItem('akun', JSON.stringify(newAkun));
      setShowSuccess('Akun berhasil ditambahkan!');
    }
    setUsername('');
    setPassword('');
    setDaerah('');
    setRole('pegawai');
    setEditIndex(null);
    setTimeout(() => setShowSuccess(null), 1500);
  };

  const handleEdit = (idx: number) => {
    setEditIndex(idx);
    setUsername(akun[idx].username);
    setPassword(akun[idx].password);
    setDaerah(akun[idx].daerah);
    setRole(akun[idx].role);
  };

  const handleDelete = (idx: number) => {
    const newAkun = akun.filter((_, i) => i !== idx);
    setAkun(newAkun);
    localStorage.setItem('akun', JSON.stringify(newAkun));
    setShowSuccess('Akun berhasil dihapus!');
    setTimeout(() => setShowSuccess(null), 1500);
    if (editIndex === idx) {
      setEditIndex(null);
      setUsername('');
      setPassword('');
      setDaerah('');
      setRole('pegawai');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 min-h-[80vh] w-full items-center justify-center">
      {/* Kontainer Kiri: List Akun */}
      <div className="flex-1 max-w-2xl rounded-2xl shadow-xl p-6 border border-blue-200 bg-white/40 backdrop-blur-md">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Daftar Akun</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-100/60 text-blue-700">
                <th className="py-2 px-3 text-left">Username</th>
                <th className="py-2 px-3 text-left">Daerah Pekerjaan</th>
                <th className="py-2 px-3 text-left">Role</th>
                <th className="py-2 px-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {akun.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400">
                    Belum ada akun.
                  </td>
                </tr>
              ) : (
                akun.map((a, idx) => (
                  <tr key={a.username} className="border-b border-blue-100 hover:bg-blue-50/40">
                    <td className="py-2 px-3">{a.username}</td>
                    <td className="py-2 px-3">{a.daerah}</td>
                    <td className="py-2 px-3 capitalize">{a.role}</td>
                    <td className="py-2 px-3">
                      <div className="flex gap-2">
                        <button
                          className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition text-xs"
                          onClick={() => handleEdit(idx)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs"
                          onClick={() => handleDelete(idx)}
                        >
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

      {/* Kontainer Kanan: Form Tambah Akun */}
      <div className="w-full md:max-w-sm rounded-2xl shadow-xl p-6 border border-green-200 bg-white/40 backdrop-blur-md self-start">
        <h2 className="text-xl font-bold mb-4 text-green-700">{editIndex !== null ? 'Edit Akun' : 'Tambah Akun Baru'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              className="mt-1 w-full border rounded px-2 py-1"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              disabled={editIndex !== null}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                className="mt-1 w-full border rounded px-2 py-1"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={5}
                maxLength={20}
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                onClick={handleGeneratePassword}
              >
                Generate
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Daerah Pekerjaan</label>
            <input
              type="text"
              className="mt-1 w-full border rounded px-2 py-1"
              value={daerah}
              onChange={e => setDaerah(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            >
              <option value="pegawai">Pegawai</option>
              <option value="gudang">Admin Gudang</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            {editIndex !== null ? 'Simpan Perubahan' : 'Tambah Akun'}
          </button>
        </form>
      </div>

      {/* Popup animasi berhasil */}
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
              {showSuccess}
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
