
import React, { useState, useRef, useMemo } from 'react';
import { User, MaintenanceLog } from '../types';
import { MAINTENANCE_ITEMS } from '../constants';
import { Wrench, Plus, Printer, History, Camera, AlertCircle, X, CheckCircle2, ShieldCheck, Trash2, MapPin, Tag } from 'lucide-react';

interface Props {
  user: User;
  logs: MaintenanceLog[];
  onAdd: (log: MaintenanceLog) => void;
  onDelete: (id: string) => void;
}

const MaintenancePage: React.FC<Props> = ({ user, logs, onAdd, onDelete }) => {
  const [data, setData] = useState<MaintenanceLog[]>(logs);
  const [showForm, setShowForm] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reportMonth, setReportMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [viewDate, setViewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    item: MAINTENANCE_ITEMS[0] as MaintenanceLog['item'],
    merekArea: '',
    deskripsiKerusakan: '',
    detailPerbaikan: '',
    foto: ''
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFileError('Ukuran file maksimal 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, foto: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      tanggal: formData.tanggal,
      item: formData.item,
      merekArea: formData.merekArea,
      deskripsiKerusakan: formData.deskripsiKerusakan,
      detailPerbaikan: formData.detailPerbaikan,
      petugas: user.name,
      foto: formData.foto,
      isValidated: false
    };
    onAdd(newLog);
    setData([newLog, ...data]);
    setFormData({ 
      tanggal: new Date().toISOString().split('T')[0],
      item: MAINTENANCE_ITEMS[0] as MaintenanceLog['item'], 
      merekArea: '', 
      deskripsiKerusakan: '', 
      detailPerbaikan: '', 
      foto: ''
    });
    setShowForm(false);
  };

  const validatedMonthlyLogs = useMemo(() => {
    return data.filter(l => l.tanggal.startsWith(reportMonth)).sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [data, reportMonth]);

  const handleValidate = (id: string) => {
    // Validation feature removed as per user request
  };

  const handleDelete = (id: string) => {
    window.alert('Delete function triggered for ID: ' + id);
    setData(data.filter(item => item.id !== id));
    console.log('Successfully deleted ID:', id);
    onDelete(id);
  };

  const getDynamicPlaceholder = () => {
    if (formData.item === 'Gedung') return 'Contoh: Ruang Resepsionis Lantai 1';
    if (['PC', 'Laptop', 'Printer'].includes(formData.item)) return 'Contoh: Axioo, Epson, HP, dll';
    if (formData.item === 'Kendaraan') return 'Contoh: Toyota Rush / BG 1184 CZ';
    if (formData.item === 'AC') return 'Contoh: AC Sharp 1.5 PK Ruang Ketua';
    return 'Detail spesifik area atau merek...';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Realisasi Pemeliharaan</h1>
          <p className="text-slate-500">Laporan pemeliharaan sarana dan prasarana {isAdmin && <span className="text-amber-600 font-bold">(Validator)</span>}</p>
        </div>
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
                  className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-amber-600 transition-colors"
                >
                  Bulan Lalu
                </button>
                <button 
                  onClick={() => {
                    const d = new Date();
                    setReportMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
                  }}
                  className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-amber-600 transition-colors"
                >
                  Bulan Ini
                </button>
              </div>
              <input type="month" className="px-2 py-1.5 text-xs font-bold text-slate-600 outline-none" value={reportMonth} onChange={(e) => setReportMonth(e.target.value)} />
              <button onClick={() => window.print()} className="flex items-center space-x-2 px-3 py-2 text-amber-600 hover:bg-amber-50 border-l">
                <Printer size={18} />
                <span className="text-xs font-bold">Cetak Rekap</span>
              </button>
            </div>
          )}
          <button onClick={() => setShowForm(!showForm)} className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-200 transition-all">
            {showForm ? <X size={18} /> : <Plus size={18} />}
            <span>{showForm ? 'Batal' : 'Lapor Pemeliharaan'}</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl no-print animate-in slide-in-from-top-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tanggal Pelaporan</label>
                <input 
                  required 
                  type="date" 
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-amber-500/10 outline-none transition-all" 
                  value={formData.tanggal} 
                  onChange={e => setFormData({...formData, tanggal: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Item Pemeliharaan</label>
                <select className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-amber-500/10 outline-none transition-all" value={formData.item} onChange={e => setFormData({...formData, item: e.target.value as any})}>
                  {MAINTENANCE_ITEMS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Merek / Area Detail</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-amber-500/10 outline-none transition-all" 
                  value={formData.merekArea} 
                  onChange={e => setFormData({...formData, merekArea: e.target.value})} 
                  placeholder={getDynamicPlaceholder()}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Kerusakan</label>
                  <textarea required rows={3} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-amber-500/10 outline-none transition-all" value={formData.deskripsiKerusakan} onChange={e => setFormData({...formData, deskripsiKerusakan: e.target.value})} placeholder="Jelaskan detail kerusakan..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Perbaikan</label>
                  <textarea required rows={3} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-amber-500/10 outline-none transition-all" value={formData.detailPerbaikan} onChange={e => setFormData({...formData, detailPerbaikan: e.target.value})} placeholder="Langkah perbaikan yang diambil..." />
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Foto Dokumentasi</label>
                <div onClick={() => fileInputRef.current?.click()} className={`relative border-2 border-dashed rounded-[2rem] h-full min-h-[250px] flex flex-col items-center justify-center cursor-pointer transition-all ${formData.foto ? 'border-amber-500 bg-amber-50' : 'bg-slate-50 border-slate-200 hover:border-amber-300'}`}>
                  {formData.foto ? (
                    <div className="absolute inset-0 p-2">
                       <img src={formData.foto} className="w-full h-full object-cover rounded-[1.8rem]" />
                       <div className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full shadow-sm text-amber-600">
                          <Camera size={16} />
                       </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-300 mb-3">
                        <Camera size={32} />
                      </div>
                      <p className="text-slate-400 font-bold text-xs">Klik untuk Unggah Foto</p>
                      <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-widest font-bold">Maksimal 10MB</p>
                    </>
                  )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" className="px-10 py-4 bg-amber-700 text-white rounded-2xl font-bold shadow-xl shadow-amber-200 hover:bg-amber-800 hover:-translate-y-1 transition-all">Simpan Laporan</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden no-print">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center"><History size={18} className="mr-2 text-amber-600" /> Log Pemeliharaan</h3>
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
                <th className="px-8 py-5">Tanggal</th>
                <th className="px-8 py-5">Item & Detail</th>
                <th className="px-8 py-5">Status Validasi</th>
                <th className="px-8 py-5">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredLogs.map(l => (
                <tr key={l.id} className="hover:bg-slate-50/50 group transition-colors">
                  <td className="px-8 py-6 text-slate-500 font-medium whitespace-nowrap">
                    <p className="font-bold text-slate-700">{l.tanggal}</p>
                    <p className="text-[10px] text-slate-400 italic">Oleh: {l.petugas}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800">{l.item}</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-md font-bold uppercase tracking-tighter">Detail</span>
                      </div>
                      <p className="text-xs text-amber-600 font-bold flex items-center">
                        <Tag size={12} className="mr-1" /> {l.merekArea}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 italic">Kerusakan: {l.deskripsiKerusakan}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {isAdmin && (
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleDelete(l.id)} 
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Hapus Laporan"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic font-medium">Belum ada laporan pemeliharaan pada tanggal ini</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="print-only p-12">
        <div className="text-center mb-10 border-b-4 border-black pb-8">
          <h1 className="text-2xl font-bold uppercase">Laporan Rekapitulasi Pemeliharaan Bulanan (DIGIMONS)</h1>
          <h2 className="text-xl font-bold mt-1">PENGADILAN AGAMA PRABUMULIH</h2>
          <p className="text-md mt-2">Periode: {new Date(reportMonth + "-01").toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</p>
        </div>
        <table className="w-full border-collapse border-2 border-black text-[10px]">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-black p-3 w-16">Tanggal</th>
              <th className="border border-black p-3 w-20">Item</th>
              <th className="border border-black p-3 w-24">Merek / Area</th>
              <th className="border border-black p-3">Kerusakan</th>
              <th className="border border-black p-3">Realisasi Perbaikan</th>
              <th className="border border-black p-3 w-16">Petugas</th>
            </tr>
          </thead>
          <tbody>
            {validatedMonthlyLogs.map(l => (
              <tr key={l.id}>
                <td className="border border-black p-3 text-center">{l.tanggal}</td>
                <td className="border border-black p-3 font-bold text-center">{l.item}</td>
                <td className="border border-black p-3 text-center">{l.merekArea}</td>
                <td className="border border-black p-3">{l.deskripsiKerusakan}</td>
                <td className="border border-black p-3 italic">{l.detailPerbaikan}</td>
                <td className="border border-black p-3 text-center">{l.petugas}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-16 text-sm">
          <div className="grid grid-cols-2 text-center">
            <div>
              <p className="font-bold">Teknisi Sarana dan Prasarana,</p>
              <div className="h-24"></div>
              <p className="font-bold underline">([Nama-Pegawai])</p>
              <p>NIP. ([NIP_Pegawai])</p>
            </div>
            <div>
              <p>Prabumulih, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
              <p className="font-bold">Kasubbag Umum & Keuangan,</p>
              <div className="h-24"></div>
              <p className="font-bold underline">([Nama-Pegawai])</p>
              <p>NIP. ([NIP_Pegawai])</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="font-bold">Mengetahui,</p>
            <p className="font-bold">Sekretaris PA Prabumulih,</p>
            <div className="h-24"></div>
            <p className="font-bold underline">([Nama-Pegawai])</p>
            <p>NIP. ([NIP_Pegawai])</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
