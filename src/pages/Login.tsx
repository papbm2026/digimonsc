
import React, { useState } from 'react';
import { User } from '../types';
import { MonitorDot, UserCircle, Key, LogIn, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LoginProps {
  onLogin: (u: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Credentials Logic
    if (username === 'PAPrabumulih' && password === 'Prabumulih2026') {
      onLogin({
        id: 'admin-main',
        name: 'Pegawai PA Prabumulih',
        username: username,
        role: 'Admin'
      });
    } else if (username === 'Admin1' && password === 'PAPrabumulih') {
      onLogin({
        id: 'officer-001',
        name: 'Petugas Sarpras (Admin1)',
        username: username,
        role: 'ChecklistMaint'
      });
    } else if (username === 'Admin2' && password === 'PAPrabumulih') {
      onLogin({
        id: 'security-001',
        name: 'Petugas Keamanan (Admin2)',
        username: username,
        role: 'Security'
      });
    } else if (username === 'Pegawai' && password === 'PAPrabumulih') {
      onLogin({
        id: 'viewer-001',
        name: 'Pegawai (Lihat Saja)',
        username: username,
        role: 'Viewer'
      });
    } else {
      setError('Username atau Password salah. Silakan hubungi IT.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center animate-in fade-in zoom-in-95 duration-500">
      <div className="max-w-md w-full mx-auto p-10 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-50 rounded-2xl mb-4">
            <MonitorDot className="w-10 h-10 text-emerald-800" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">DIGIMONS</h2>
          <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest mt-1">Halaman Pegawai</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600 animate-bounce">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-xs font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Username Pegawai</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300">
                <UserCircle size={20} />
              </div>
              <input
                required
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Kata Sandi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300">
                <Key size={20} />
              </div>
              <input
                required
                type="password"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-emerald-800 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-200 hover:-translate-y-1"
          >
            <LogIn size={20} />
            <span>Masuk ke Dashboard</span>
          </button>
        </form>

        <div className="mt-10 text-center border-t border-slate-50 pt-8">
          <Link to="/public" className="text-slate-400 hover:text-emerald-800 text-xs font-bold flex items-center justify-center group transition-colors">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Kembali ke Layanan Umum
          </Link>
        </div>
      </div>
      
      <p className="text-center text-slate-300 text-[10px] mt-8 uppercase tracking-[0.2em]">
        &copy; 2026 Pengadilan Agama Prabumulih
      </p>
    </div>
  );
};

export default Login;
