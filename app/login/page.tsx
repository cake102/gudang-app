// app/login/page.tsx
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

const defaultAkunGudang = {
  username: "admin",
  password: "admin123",
  role: "gudang",
};

const defaultAkunPegawai = {
  username: "pegawai",
  password: "pegawai123",
  role: "pegawai",
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("gudang");
  const [showAnim, setShowAnim] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Hanya tambahkan akun admin default jika localStorage kosong
  if (typeof window !== "undefined") {
    if (!localStorage.getItem("akun")) {
        localStorage.setItem("akun", JSON.stringify([defaultAkunGudang, defaultAkunPegawai]));
    }
  }
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Cek akun di localStorage
    const akun = JSON.parse(localStorage.getItem("akun") || "[]");
    const user = akun.find(
      (a: any) =>
        a.username === username &&
        a.password === password &&
        a.role === role
    );
    if (!user) {
      setError("Username, password, atau role salah!");
      return;
    }
    setError("");
    localStorage.setItem("role", role);
    localStorage.setItem("username", username);
    setShowAnim(true);
    setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        if (role === "gudang") {
          router.replace("/dashboard");
        } else {
          router.replace("/dashboard-pegawai");
        }
      }, 700);
    }, 1600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100 relative overflow-hidden">
      {/* Gambar background sangat transparan (selalu tampil) */}
      <img
        src="/tgi-2.jpg"
        alt="Transgasindo"
        className="fixed inset-0 w-full h-full object-cover opacity-10 select-none pointer-events-none"
        style={{ zIndex: 0 }}
        draggable={false}
      />

      {/* Animasi Logo dengan Background Gambar Transparan */}
      {showAnim && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur transition-opacity duration-700 ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <img
            src="/tgi-2.jpg"
            alt="Transgasindo"
            className="absolute inset-0 w-full h-full object-cover opacity-10 select-none pointer-events-none"
            style={{ zIndex: 0 }}
            draggable={false}
          />
          <div className="flex flex-col items-center relative z-10">
            <img
              src="/logo-tgi.png"
              alt="Logo TGI"
              className="w-28 h-28 animate-pulseBeat"
              style={{ zIndex: 1 }}
            />
            <div className="mt-6 text-2xl font-bold text-blue-800 animate-fadeIn" style={{ zIndex: 1 }}>
              Selamat Datang!
            </div>
          </div>
          <style jsx global>{`
            @keyframes pulseBeat {
              0% { transform: scale(1); }
              20% { transform: scale(1.12); }
              40% { transform: scale(0.96); }
              60% { transform: scale(1.08); }
              80% { transform: scale(0.98); }
              100% { transform: scale(1); }
            }
            .animate-pulseBeat {
              animation: pulseBeat 1.4s cubic-bezier(0.4,0,0.2,1);
            }
            @keyframes fadeIn {
              from { opacity: 0 }
              to { opacity: 1 }
            }
            .animate-fadeIn {
              animation: fadeIn 1s;
            }
          `}</style>
        </div>
      )}

      {/* Form Login */}
      {!showAnim && (
        <form
          onSubmit={handleLogin}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-4 relative z-10"
        >
          <h1 className="text-2xl font-bold text-blue-700 mb-4 text-center">Login</h1>
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}
          <input
            type="text"
            placeholder="Username"
            className="border rounded px-3 py-2"
            value={username}
            required
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded px-3 py-2"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="gudang">Admin Gudang</option>
            <option value="pegawai">Pegawai Biasa</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
          <div className="text-xs text-gray-500 mt-2">
            <b>Contoh akun admin gudang:</b><br />
            Username: <span className="font-mono">admin</span><br />
            Password: <span className="font-mono">admin123</span>
          </div>
        </form>
      )}
    </div>
  );
}
