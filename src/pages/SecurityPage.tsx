
import React, { useState, useMemo } from 'react';
import { User, SecurityLog } from '../types';
import { SECURITY_STAFF, SECURITY_AREAS } from '../constants';
import { 
  Shield, Plus, Printer, Check, X, Clock, MapPin, Lamp, Power, Lock, Key, 
  Sun, Moon, AlertTriangle, UserCircle, CheckSquare, Square, AlertCircle, 
  CheckCircle2, ShieldCheck, Trash2, Search, Users, Sparkles, UserCheck, 
  PackageSearch, Car, Eye, ShieldAlert, AlignLeft
} from 'lucide-react';

interface Props {
  user: User;
  logs: SecurityLog[];
  onAdd: (log: SecurityLog) => void;
  onDelete: (id: string) => void;
}

const SHIFT_INFO = {
  'Pagi': '07.00 - 12.00',
  'Siang': '13.00 - 18.00',
  'Malam': '19.00 - 06.00'
};

const SecurityPage: React.FC<Props> = ({ user, logs, onAdd, onDelete }) => {
  const [data, setData] = useState<SecurityLog[]>(logs);
  const [showForm, setShowForm] = useState(false);
  const [reportMonth, setReportMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const [viewDate, setViewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    petugas: SECURITY_STAFF[0],
    shift: 'Pagi' as SecurityLog['shift'],
    area: '' as SecurityLog['area'] | '',
    statusAman: true,
    keteranganTidakAman: '',
    isLampuMati: false,
    isElektronikOff: false,
    isPagarGembok: false,
    isPintuKunci: false,
    isLampuLuarHidup: false,
    isSterilisasi: false,
    isPengaturanPengunjung: false,
    isAksesPihak: false,
    isAreaTerbatas: false,
    isIdentifikasiPengunjung: false,
    isPeriksaBarang: false,
    isPeriksaKendaraan: false,
    isPeriksaPengunjungPTSP: false,
    isAksesKeluarMasukPTSP: false,
    isPengaturanPengunjungPTSP: false,
  });

  const today = new Date().toISOString().split('T')[0];
  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 20);
    return d.toISOString().split('T')[0];
  }, []);

  const filteredLogs = useMemo(() => 
    data.filter(l => l.tanggal === viewDate).sort((a, b) => b.id.localeCompare(a.id))
  , [data, viewDate]);

  const isAdmin = user.username === 'PAPrabumulih';

  const usedAreas = useMemo(() => {
    return data.filter(l => l.tanggal === formData.tanggal && l.shift === formData.shift).map(l => l.area);
  }, [data, formData.tanggal, formData.shift]);

  const validatedMonthlyLogs = useMemo(() => {
    return data.filter(l => l.tanggal.startsWith(reportMonth)).sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [data, reportMonth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.area) return;
    
    // Reset keterangan jika status aman
    const finalData = {
        ...formData,
        keteranganTidakAman: formData.statusAman ? '' : formData.keteranganTidakAman
    };

    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      ...finalData as SecurityLog,
      isValidated: false
    };
    onAdd(newLog);
    setData([newLog, ...data]);
    setShowForm(false);
    setFormData({ 
      ...formData, 
      tanggal: new Date().toISOString().split('T')[0],
      area: '', 
      statusAman: true, 
      keteranganTidakAman: '', 
      isLampuMati: false, 
      isElektronikOff: false, 
      isPagarGembok: false, 
      isPintuKunci: false, 
      isLampuLuarHidup: false,
      isSterilisasi: false,
      isPengaturanPengunjung: false,
      isAksesPihak: false,
      isAreaTerbatas: false,
      isIdentifikasiPengunjung: false,
      isPeriksaBarang: false,
      isPeriksaKendaraan: false,
      isPeriksaPengunjungPTSP: false,
      isAksesKeluarMasukPTSP: false,
      isPengaturanPengunjungPTSP: false,
    });
  };

  const handleValidate = (id: string) => {
    // Validation feature removed as per user request
  };

  const handleDelete = (id: string) => {
    window.alert('Delete function triggered for ID: ' + id);
    setData(data.filter(item => item.id !== id));
    console.log('Successfully deleted ID:', id);
    onDelete(id); // Keep parent state in sync
  };

  const availableAreas = useMemo(() => {
    return (SECURITY_AREAS as SecurityLog['area'][]).filter(area => formData.shift === 'Malam' ? area === 'Gedung' : area !== 'Gedung');
  }, [formData.shift]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div><h1 className="text-2xl font-bold text-slate-800">Laporan Keamanan</h1><p className="text-slate-500">Log harian {isAdmin && <span className="text-blue-600 font-bold">(Validator)</span>}</p></div>
        <div className="flex items-center space-x-3">
          {isAdmin && (
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-2">
              <div className="flex items-center border-r pr-2 mr-2">
                <button 
                  onClick={() => {
                    const d = new Date();
                    d.setMonth(d.getMonth() - 1);
                    setReportMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
                  }}
                  className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Bulan Lalu
                </button>
                <button 
                  onClick={() => {
                    const d = new Date();
                    setReportMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
                  }}
                  className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Bulan Ini
                </button>
              </div>
              <input type="month" className="px-2 py-1.5 text-xs font-bold text-slate-600 outline-none" value={reportMonth} onChange={(e) => setReportMonth(e.target.value)} />
              <button onClick={() => window.print()} className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 border-l"><Printer size={18} /><span className="text-xs font-bold">Cetak Rekap</span></button>
            </div>
          )}
          <button onClick={() => setShowForm(!showForm)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">{showForm ? <X size={18} /> : <Plus size={18} />}<span>{showForm ? 'Batal' : 'Input Laporan'}</span></button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl no-print animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase">Tanggal Pelaporan</label>
                <input 
                  required 
                  type="date" 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white outline-none transition-all" 
                  value={formData.tanggal} 
                  onChange={e => setFormData({...formData, tanggal: e.target.value})} 
                />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase">Petugas Bertugas</label>
                <div className="grid grid-cols-2 gap-3">
                  {SECURITY_STAFF.map(name => (
                    <button key={name} type="button" onClick={() => setFormData({ ...formData, petugas: name })} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all ${formData.petugas === name ? 'bg-blue-50 border-blue-600 text-blue-900' : 'bg-white border-slate-100 text-slate-400'}`}>
                      <UserCircle size={20} className={formData.petugas === name ? 'text-blue-600' : 'text-slate-300'} /><span className="text-sm font-bold">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase">Shift Waktu</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Pagi', 'Siang', 'Malam'] as const).map(s => (
                    <button key={s} type="button" onClick={() => setFormData({ ...formData, shift: s, area: '' })} className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${formData.shift === s ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>
                      <span className="text-xs font-bold">{s}</span>
                      <span className={`text-[8px] mt-1 ${formData.shift === s ? 'text-blue-100' : 'text-slate-300'}`}>{SHIFT_INFO[s]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase">Pilih Area</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {availableAreas.map(area => {
                  const isTaken = usedAreas.includes(area);
                  return (
                    <button key={area} type="button" disabled={isTaken} onClick={() => setFormData({ ...formData, area: area })} className={`relative flex flex-col items-center p-5 rounded-3xl border-2 transition-all ${formData.area === area ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm' : isTaken ? 'bg-slate-50 text-slate-300' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-300'}`}>
                      <MapPin size={24} className="mb-2" /><span className="text-sm font-bold">{area}</span>
                      {isTaken && <span className="text-[8px] mt-1 text-red-400 font-bold uppercase">Sudah Terisi (Shift {formData.shift})</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Checklist Khusus Shift Malam Area Gedung */}
            {formData.area === 'Gedung' && formData.shift === 'Malam' && (
              <div className="space-y-4 p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100 animate-in fade-in duration-300">
                <label className="block text-xs font-bold text-blue-700 uppercase flex items-center mb-4">
                   <Moon size={14} className="mr-2" /> Checklist Keamanan Malam (Gedung)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button type="button" onClick={() => setFormData({...formData, isLampuMati: !formData.isLampuMati})} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all ${formData.isLampuMati ? 'bg-white border-blue-500 text-blue-900 shadow-sm' : 'bg-white/50 border-slate-200 text-slate-400'}`}>
                    <div className={`p-2 rounded-xl ${formData.isLampuMati ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-300'}`}><Lamp size={18} /></div>
                    <p className="text-[11px] font-bold text-left">Lampu ruangan tidak terpakai dimatikan</p>
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, isElektronikOff: !formData.isElektronikOff})} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all ${formData.isElektronikOff ? 'bg-white border-blue-500 text-blue-900 shadow-sm' : 'bg-white/50 border-slate-200 text-slate-400'}`}>
                    <div className={`p-2 rounded-xl ${formData.isElektronikOff ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-300'}`}><Power size={18} /></div>
                    <p className="text-[11px] font-bold text-left">Elektronik/PC dipastikan kondisi off</p>
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, isPagarGembok: !formData.isPagarGembok})} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all ${formData.isPagarGembok ? 'bg-white border-blue-500 text-blue-900 shadow-sm' : 'bg-white/50 border-slate-200 text-slate-400'}`}>
                    <div className={`p-2 rounded-xl ${formData.isPagarGembok ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-300'}`}><Lock size={18} /></div>
                    <p className="text-[11px] font-bold text-left">Pagar utama telah digembok</p>
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, isPintuKunci: !formData.isPintuKunci})} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all ${formData.isPintuKunci ? 'bg-white border-blue-500 text-blue-900 shadow-sm' : 'bg-white/50 border-slate-200 text-slate-400'}`}>
                    <div className={`p-2 rounded-xl ${formData.isPintuKunci ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-300'}`}><Key size={18} /></div>
                    <p className="text-[11px] font-bold text-left">Pintu akses masuk gedung dikunci</p>
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, isLampuLuarHidup: !formData.isLampuLuarHidup})} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all ${formData.isLampuLuarHidup ? 'bg-white border-blue-500 text-blue-900 shadow-sm' : 'bg-white/50 border-slate-200 text-slate-400'}`}>
                    <div className={`p-2 rounded-xl ${formData.isLampuLuarHidup ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-300'}`}><Sun size={18} /></div>
                    <p className="text-[11px] font-bold text-left">Lampu luar telah dihidupkan</p>
                  </button>
                </div>
              </div>
            )}

            {/* Checklist Khusus Tunggu Sidang */}
            {formData.area === 'Tunggu Sidang' && (
              <div className="space-y-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-200 animate-in fade-in duration-300">
                <label className="block text-xs font-bold text-blue-600 uppercase flex items-center mb-4">
                   <Shield size={14} className="mr-2" /> Checklist Keamanan Ruang Tunggu Sidang
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button type="button" onClick={() => setFormData({...formData, isSterilisasi: !formData.isSterilisasi})} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all ${formData.isSterilisasi ? 'bg-white border-blue-500 text-blue-900 shadow-sm' : 'bg-slate-100/50 border-slate-200 text-slate-400'}`}>
                    <div className={`p-2 rounded-xl ${formData.isSterilisasi ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-400'}`}><ShieldAlert size={18} /></div>
                    <div className="text-left"><p className="text-xs font-bold">Sterilisasi Ruang Sidang</p><p className="text-[10px] opacity-70">Pengecekan barang berbahaya</p></div>
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, isPengaturanPengunjung: !formData.isPengaturanPengunjung})} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all ${formData.isPengaturanPengunjung ? 'bg-white border-blue-500 text-blue-900 shadow-sm' : 'bg-slate-100/50 border-slate-200 text-slate-400'}`}>
                    <div className={`p-2 rounded-xl ${formData.isPengaturanPengunjung ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-400'}`}><Users size={18} /></div>
                    <div className="text-left"><p className="text-xs font-bold">Pengaturan Pengunjung Sidang</p><p className="text-[10px] opacity-70">Ketertiban area ruang tunggu</p></div>
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, isAksesPihak: !formData.isAksesPihak})} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all ${formData.isAksesPihak ? 'bg-white border-blue-500 text-blue-900 shadow-sm' : 'bg-slate-100/50 border-slate-200 text-slate-400'}`}>
                    <div className={`p-2 rounded-xl ${formData.isAksesPihak ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-400'}`}><UserCheck size={18} /></div>
                    <div className="text-left"><p className="text-xs font-bold">Pemeriksaan Identitas Pihak</p><p className="text-[10px] opacity-70">Pemberian kartu identitas pengunjung</p></div>
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, isAreaTerbatas: !formData.isAreaTerbatas})} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all ${formData.isAreaTerbatas ? 'bg-white border-blue-500 text-blue-900 shadow-sm' : 'bg-slate-100/50 border-slate-200 text-slate-400'}`}>
                    <div className={`p-2 rounded-xl ${formData.isAreaTerbatas ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-400'}`}><Lock size={18} /></div>
                    <div className="text-left"><p className="text-xs font-bold">Pengamanan Area Terbatas</p><p className="text-[10px] opacity-70">Sterilisasi area jalur pegawai</p></div>
                  </button>
                </div>
              </div>
            )}

            {/* Checklist Khusus Pos Depan */}
            {formData.area === 'Pos Depan' && (
              <div className="space-y-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-200 animate-in fade-in duration-300">
                <label className="block text-xs font-bold text-emerald-600 uppercase flex items-center mb-4">
                   <Shield size={14} className="mr-2" /> Checklist Keamanan Pos Depan
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button type="button" onClick={() => setFormData({...formData, isIdentifikasiPengunjung: !formData.isIdentifikasiPengunjung})} className={`flex flex-col items-center space-y-3 p-5 rounded-2xl border-2 transition-all ${formData.isIdentifikasiPengunjung ? 'bg-white border-emerald-500 text-emerald-900 shadow-sm' : 'bg-slate-100/50 border-slate-200 text-slate-400'}`}>
                    <div className={`p-3 rounded-2xl ${formData.isIdentifikasiPengunjung ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}><UserCheck size={24} /></div>
                    <div className="text-center"><p className="text-xs font-bold">Identifikasi Pengunjung</p><p className="text-[9px] opacity-70">Buku tamu & data identitas</p></div>
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, isPeriksaBarang: !formData.isPeriksaBarang})} className={`flex flex-col items-center space-y-3 p-5 rounded-2xl border-2 transition-all ${formData.isPeriksaBarang ? 'bg-white border-emerald-500 text-emerald-900 shadow-sm' : 'bg-slate-100/50 border-slate-200 text-slate-400'}`}>
                    <div className={`p-3 rounded-2xl ${formData.isPeriksaBarang ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}><PackageSearch size={24} /></div>
                    <div className="text-center"><p className="text-xs font-bold">Pemeriksaan Barang</p><p className="text-[9px] opacity-70">Barang bawaan tamu/pihak</p></div>
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, isPeriksaKendaraan: !formData.isPeriksaKendaraan})} className={`flex flex-col items-center space-y-3 p-5 rounded-2xl border-2 transition-all ${formData.isPeriksaKendaraan ? 'bg-white border-emerald-500 text-emerald-900 shadow-sm' : 'bg-slate-100/50 border-slate-200 text-slate-400'}`}>
                    <div className={`p-3 rounded-2xl ${formData.isPeriksaKendaraan ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}><Car size={24} /></div>
                    <div className="text-center"><p className="text-xs font-bold">Pemeriksaan Kendaraan</p><p className="text-[9px] opacity-70">Kendaraan yang masuk/parkir</p></div>
                  </button>
                </div>
              </div>
            )}

            {/* Checklist Khusus Area PTSP */}
            {formData.area === 'PTSP' && (
              <div className="space-y-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-200 animate-in fade-in duration-300">
                <label className="block text-xs font-bold text-amber-600 uppercase flex items-center mb-4">
                   <Shield size={14} className="mr-2" /> Checklist Keamanan Area PTSP
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button type="button" onClick={() => setFormData({...formData, isPeriksaPengunjungPTSP: !formData.isPeriksaPengunjungPTSP})} className={`flex flex-col items-center space-y-3 p-5 rounded-2xl border-2 transition-all ${formData.isPeriksaPengunjungPTSP ? 'bg-white border-amber-500 text-amber-900 shadow-sm' : 'bg-slate-100/50 border-slate-200 text-slate-400'}`}>
                    <div className={`p-3 rounded-2xl ${formData.isPeriksaPengunjungPTSP ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'}`}><UserCheck size={24} /></div>
                    <p className="text-[10px] font-bold text-center">Pengecekan pengunjung & barang</p>
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, isAksesKeluarMasukPTSP: !formData.isAksesKeluarMasukPTSP})} className={`flex flex-col items-center space-y-3 p-5 rounded-2xl border-2 transition-all ${formData.isAksesKeluarMasukPTSP ? 'bg-white border-amber-500 text-amber-900 shadow-sm' : 'bg-slate-100/50 border-slate-200 text-slate-400'}`}>
                    <div className={`p-3 rounded-2xl ${formData.isAksesKeluarMasukPTSP ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'}`}><Eye size={24} /></div>
                    <p className="text-[10px] font-bold text-center">Monitor akses keluar masuk</p>
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, isPengaturanPengunjungPTSP: !formData.isPengaturanPengunjungPTSP})} className={`flex flex-col items-center space-y-3 p-5 rounded-2xl border-2 transition-all ${formData.isPengaturanPengunjungPTSP ? 'bg-white border-amber-500 text-amber-900 shadow-sm' : 'bg-slate-100/50 border-slate-200 text-slate-400'}`}>
                    <div className={`p-3 rounded-2xl ${formData.isPengaturanPengunjungPTSP ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'}`}><Users size={24} /></div>
                    <p className="text-[10px] font-bold text-center">Ketertiban pengunjung PTSP</p>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase">Status Keamanan Umum</label>
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setFormData({ ...formData, statusAman: true, keteranganTidakAman: '' })} className={`flex items-center justify-center space-x-3 p-5 rounded-[2rem] border-2 transition-all ${formData.statusAman ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm' : 'bg-white border-slate-100'}`}>
                  <CheckCircle2 size={24} className={formData.statusAman ? 'text-emerald-600' : 'text-slate-200'} /><span className="font-bold">Aman</span>
                </button>
                <button type="button" onClick={() => setFormData({ ...formData, statusAman: false })} className={`flex items-center justify-center space-x-3 p-5 rounded-[2rem] border-2 transition-all ${!formData.statusAman ? 'bg-red-50 border-red-500 text-red-900 shadow-sm' : 'bg-white border-slate-100'}`}>
                  <AlertCircle size={24} className={!formData.statusAman ? 'text-red-600' : 'text-slate-200'} /><span className="font-bold">Tidak Aman</span>
                </button>
              </div>
            </div>

            {!formData.statusAman && (
              <div className="space-y-3 animate-in slide-in-from-left-4 duration-300">
                <label className="block text-xs font-bold text-red-600 uppercase flex items-center">
                  <AlignLeft size={14} className="mr-2" /> Keterangan Kondisi Tidak Aman
                </label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-5 py-4 rounded-3xl bg-red-50/30 border border-red-100 focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all placeholder:text-red-200"
                  placeholder="Sebutkan detail temuan atau alasan kondisi tidak aman..."
                  value={formData.keteranganTidakAman}
                  onChange={e => setFormData({...formData, keteranganTidakAman: e.target.value})}
                />
              </div>
            )}

            <button type="submit" disabled={!formData.area} className={`w-full py-5 rounded-[2rem] font-bold shadow-xl transition-all ${!formData.area ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-800 text-white shadow-blue-200 hover:bg-blue-900 hover:-translate-y-1'}`}>Simpan Laporan Keamanan</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden no-print">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center"><Shield size={18} className="mr-2 text-blue-600" /> Log Keamanan</h3>
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Filter:</span>
            <input 
              type="date" 
              min={minDate}
              max={today}
              value={viewDate}
              onChange={(e) => setViewDate(e.target.value)}
              className="text-xs font-bold text-slate-600 outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Waktu & Shift</th>
                <th className="px-8 py-5">Petugas</th>
                <th className="px-8 py-5">Area & Kondisi</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredLogs.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-700">{item.tanggal}</p>
                    <div className="flex items-center mt-1">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[9px] font-bold uppercase tracking-tight mr-2">{item.shift}</span>
                        <span className="text-[9px] text-slate-400 font-medium italic">{SHIFT_INFO[item.shift]}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-600">{item.petugas}</td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-800">{item.area}</p>
                    <div className="mt-1 flex flex-col">
                        <span className={`text-[9px] font-bold uppercase ${item.statusAman ? 'text-emerald-600' : 'text-red-600'}`}>
                            {item.statusAman ? 'KONDISI AMAN' : 'TIDAK AMAN'}
                        </span>
                        {!item.statusAman && item.keteranganTidakAman && (
                            <p className="text-[10px] text-red-400 mt-1 max-w-[200px] truncate italic">"{item.keteranganTidakAman}"</p>
                        )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {isAdmin && (
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors" title="Hapus Laporan">
                            <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-slate-400 italic">Belum ada laporan keamanan pada tanggal ini.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINT SECTION SEPARATED BY AREA */}
      <div className="print-only p-8">
        <div className="text-center mb-10 border-b-4 border-black pb-8">
          <h1 className="text-2xl font-bold uppercase">Laporan Rekapitulasi Keamanan Bulanan (DIGIMONS)</h1>
          <h2 className="text-xl font-bold mt-1">PENGADILAN AGAMA PRABUMULIH</h2>
          <p className="text-md mt-2">Periode: {new Date(reportMonth + "-01").toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</p>
        </div>

        {SECURITY_AREAS.map((areaName) => {
          const areaLogs = validatedMonthlyLogs.filter(l => l.area === areaName);
          
          return (
            <div key={areaName} className="mb-12 break-inside-avoid">
              <div className="bg-slate-100 p-2 border-2 border-black mb-1">
                <h3 className="text-sm font-bold uppercase tracking-wide">Area Kerja: {areaName}</h3>
              </div>
              <table className="w-full border-collapse border-2 border-black text-[9px]">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-black p-2 w-20">Tanggal</th>
                    <th className="border border-black p-2 w-32">Shift & Waktu</th>
                    <th className="border border-black p-2 w-24">Petugas</th>
                    <th className="border border-black p-2">Checklist & Keterangan</th>
                    <th className="border border-black p-2 w-20">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {areaLogs.length > 0 ? (
                    areaLogs.map(l => (
                      <tr key={l.id}>
                        <td className="border border-black p-2 text-center">{l.tanggal}</td>
                        <td className="border border-black p-2 text-center font-bold">
                            {l.shift}
                            <br/>
                            <span className="text-[8px] font-normal">{SHIFT_INFO[l.shift]}</span>
                        </td>
                        <td className="border border-black p-2 text-center">{l.petugas}</td>
                        <td className="border border-black p-2">
                          <div className="space-y-1">
                            {l.area === 'Tunggu Sidang' ? (
                              <>
                                <div className="flex items-center justify-between"><span>1. Sterilisasi Ruang Sidang</span><span className="font-bold">{l.isSterilisasi ? '[V]' : '[ ]'}</span></div>
                                <div className="flex items-center justify-between"><span>2. Pengaturan Pengunjung Sidang</span><span className="font-bold">{l.isPengaturanPengunjung ? '[V]' : '[ ]'}</span></div>
                                <div className="flex items-center justify-between"><span>3. Pemeriksaan Identitas Pihak</span><span className="font-bold">{l.isAksesPihak ? '[V]' : '[ ]'}</span></div>
                                <div className="flex items-center justify-between"><span>4. Pengamanan Area Terbatas</span><span className="font-bold">{l.isAreaTerbatas ? '[V]' : '[ ]'}</span></div>
                              </>
                            ) : l.area === 'Pos Depan' ? (
                              <>
                                <div className="flex items-center justify-between"><span>1. Identifikasi Pengunjung</span><span className="font-bold">{l.isIdentifikasiPengunjung ? '[V]' : '[ ]'}</span></div>
                                <div className="flex items-center justify-between"><span>2. Pemeriksaan Barang Bawaan</span><span className="font-bold">{l.isPeriksaBarang ? '[V]' : '[ ]'}</span></div>
                                <div className="flex items-center justify-between"><span>3. Pemeriksaan Kendaraan</span><span className="font-bold">{l.isPeriksaKendaraan ? '[V]' : '[ ]'}</span></div>
                              </>
                            ) : l.area === 'PTSP' ? (
                              <>
                                <div className="flex items-center justify-between"><span>1. Pemeriksaan Pengunjung & Barang</span><span className="font-bold">{l.isPeriksaPengunjungPTSP ? '[V]' : '[ ]'}</span></div>
                                <div className="flex items-center justify-between"><span>2. Monitor Akses Keluar Masuk</span><span className="font-bold">{l.isAksesKeluarMasukPTSP ? '[V]' : '[ ]'}</span></div>
                                <div className="flex items-center justify-between"><span>3. Ketertiban Pengunjung PTSP</span><span className="font-bold">{l.isPengaturanPengunjungPTSP ? '[V]' : '[ ]'}</span></div>
                              </>
                            ) : l.area === 'Gedung' && l.shift === 'Malam' ? (
                              <>
                                <div className="flex items-center justify-between"><span>1. Lampu ruangan tidak terpakai dimatikan</span><span className="font-bold">{l.isLampuMati ? '[V]' : '[ ]'}</span></div>
                                <div className="flex items-center justify-between"><span>2. Elektronik/PC dipastikan kondisi off</span><span className="font-bold">{l.isElektronikOff ? '[V]' : '[ ]'}</span></div>
                                <div className="flex items-center justify-between"><span>3. Pagar utama telah digembok</span><span className="font-bold">{l.isPagarGembok ? '[V]' : '[ ]'}</span></div>
                                <div className="flex items-center justify-between"><span>4. Pintu akses masuk gedung dikunci</span><span className="font-bold">{l.isPintuKunci ? '[V]' : '[ ]'}</span></div>
                                <div className="flex items-center justify-between"><span>5. Lampu luar telah dihidupkan</span><span className="font-bold">{l.isLampuLuarHidup ? '[V]' : '[ ]'}</span></div>
                              </>
                            ) : (
                              <div className="text-slate-400 italic">Keamanan Area {l.area} (Standar)</div>
                            )}
                            
                            {!l.statusAman && l.keteranganTidakAman && (
                                <div className="mt-2 p-1 border-t border-black bg-slate-50">
                                    <span className="font-bold">KETERANGAN TEMUAN:</span>
                                    <p className="italic">"{l.keteranganTidakAman}"</p>
                                </div>
                            )}
                          </div>
                        </td>
                        <td className={`border border-black p-2 text-center font-bold ${l.statusAman ? 'text-emerald-700' : 'text-red-700'}`}>{l.statusAman ? 'AMAN' : 'TIDAK AMAN'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="border border-black p-4 text-center text-slate-400 italic font-medium tracking-wide">Data tidak ditemukan untuk area ini pada bulan yang dipilih.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        })}
        
        <div className="mt-16 text-sm">
          <div className="grid grid-cols-2 text-center gap-20">
            <div>
              <p className="font-bold mb-20">Kasubbag Umum & Keuangan,</p>
              <p className="font-bold underline">([Nama-Pegawai])</p>
              <p>NIP. ([NIP_Pegawai])</p>
            </div>
            <div>
              <p className="mb-2">Prabumulih, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
              <p className="font-bold mb-20">Sekretaris Pengadilan Agama Prabumulih,</p>
              <p className="font-bold underline">([Nama-Pegawai])</p>
              <p>NIP. ([NIP_Pegawai])</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
