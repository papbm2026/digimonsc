
import React, { useState } from 'react';
import { User, Keluhan } from '../types';
import { Bell, UserCircle, MessageSquare, Clock, AlertCircle, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  user: User;
  pendingComplaints: Keluhan[];
}

const Header: React.FC<HeaderProps> = ({ user, pendingComplaints }) => {
  const [showNotif, setShowNotif] = useState(false);
  const count = pendingComplaints.length;
  
  // Notifikasi hanya muncul untuk akun Admin (username: PAPrabumulih)
  const isMainAdmin = user.role === 'Admin';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between no-print shrink-0 relative z-50">
      <h2 className="text-lg font-semibold text-slate-800">
        Selamat Datang, {user.name}
      </h2>
      <div className="flex items-center space-x-4">
        {isMainAdmin && (
          <div className="relative">
            <button 
              onClick={() => setShowNotif(!showNotif)}
              className={`p-2 transition-colors relative rounded-xl ${showNotif ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:text-emerald-600'}`}
            >
              <Bell size={20} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full border-2 border-white text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotif && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center">
                    <Bell size={14} className="mr-2 text-emerald-600" />
                    Notifikasi Keluhan
                  </h4>
                  <button onClick={() => setShowNotif(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={16} />
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {pendingComplaints.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                      {pendingComplaints.slice(0, 5).map((k) => (
                        <div key={k.id} className="p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg shrink-0 ${k.kategori === 'Kebersihan' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                              {k.kategori === 'Kebersihan' ? <MessageSquare size={14} /> : <AlertCircle size={14} />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{k.deskripsi}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">Lokasi: {k.lokasi}</p>
                              <div className="flex items-center mt-2 text-[10px] text-slate-400">
                                <Clock size={10} className="mr-1" />
                                <span>{new Date(k.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="mx-1.5">•</span>
                                <span className="font-semibold text-emerald-600 uppercase tracking-tighter">{k.kategori}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell size={20} className="text-slate-200" />
                      </div>
                      <p className="text-xs text-slate-400 font-medium">Tidak ada keluhan baru</p>
                    </div>
                  )}
                </div>
                {count > 0 && (
                  <Link 
                    to="/complaints" 
                    onClick={() => setShowNotif(false)}
                    className="block p-3 text-center text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center"
                  >
                    Lihat Semua Keluhan <ExternalLink size={12} className="ml-1.5" />
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500 capitalize">
              {user.role === 'ChecklistMaint' ? 'Petugas Sarpras' : user.role === 'Security' ? 'Keamanan' : user.role === 'Viewer' ? 'Pegawai PA PBM' : 'Admin'}
            </p>
          </div>
          <UserCircle size={32} className="text-emerald-800" />
        </div>
      </div>
    </header>
  );
};

export default Header;
