
import React, { useState } from 'react';
import { Keluhan, StatusTindakLanjut } from '../types';
import { CheckCircle2, Clock, AlertCircle, MessageSquare, ChevronRight, Briefcase, User, Building2, Sofa, Monitor, ShieldCheck, Trash2 } from 'lucide-react';

interface Props {
  keluhans: Keluhan[];
  onUpdate: (k: Keluhan) => void;
  onDelete: (id: string) => void;
}

const ComplaintsAdmin: React.FC<Props> = ({ keluhans, onUpdate, onDelete }) => {
  const [data, setData] = useState<Keluhan[]>(keluhans);
  const [selectedK, setSelectedK] = useState<Keluhan | null>(null);

  const handleUpdateStatus = (status: StatusTindakLanjut) => {
    if (!selectedK) return;
    if (!selectedK.isValidated) {
      alert('Laporan harus divalidasi terlebih dahulu sebelum mengubah status tindak lanjut.');
      return;
    }
    const updated = { ...selectedK, status };
    onUpdate(updated);
    setSelectedK(updated);
    setData(data.map(k => k.id === updated.id ? updated : k));
  };

  const handleValidate = () => {
    if (!selectedK) return;
    const updated = { ...selectedK, isValidated: true };
    onUpdate(updated);
    setSelectedK(updated);
    setData(data.map(k => k.id === updated.id ? updated : k));
  };

  const handleDelete = (id: string) => {
    window.alert('Delete function triggered for ID: ' + id);
    setData(data.filter(item => item.id !== id));
    console.log('Successfully deleted ID:', id);
    onDelete(id);
    if (selectedK?.id === id) {
      setSelectedK(null);
    }
  };

  const getSubCategoryIcon = (sub?: string) => {
    if (sub === 'Gedung') return <Building2 size={14} className="mr-1" />;
    if (sub === 'Peralatan Non TIK') return <Sofa size={14} className="mr-1" />;
    if (sub === 'Peralatan TIK') return <Monitor size={14} className="mr-1" />;
    return null;
  };

  return (
    <div className="flex h-full gap-6 animate-in fade-in duration-500">
      {/* List */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Keluhan & Saran</h1>
        {data.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
            <MessageSquare size={48} className="mx-auto mb-4 text-slate-200" />
            <p className="text-slate-400">Belum ada keluhan masuk.</p>
          </div>
        ) : (
          data.map(k => (
            <button
              key={k.id}
              onClick={() => setSelectedK(k)}
              className={`w-full text-left p-6 rounded-3xl border transition-all flex items-center justify-between group ${
                selectedK?.id === k.id ? 'bg-emerald-50 border-emerald-500 shadow-md' : 'bg-white border-slate-100 hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl ${
                  k.status === 'Selesai' ? 'bg-emerald-100 text-emerald-600' : 
                  k.status === 'Proses' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                }`}>
                  {k.status === 'Selesai' ? <CheckCircle2 size={24} /> : 
                   k.status === 'Proses' ? <Clock size={24} /> : <AlertCircle size={24} />}
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      k.isValidated ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {k.isValidated ? 'VALIDATED' : 'WAITING VALIDATION'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      k.kategori === 'Kebersihan' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {k.kategori}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 mt-1">{k.deskripsi}</h4>
                  <p className="text-xs text-slate-500">Lokasi: {k.lokasi} • Pelapor: {k.pelapor}</p>
                </div>
              </div>
              <ChevronRight size={20} className={`transition-transform ${selectedK?.id === k.id ? 'translate-x-2 text-emerald-600' : 'text-slate-300'}`} />
            </button>
          ))
        )}
      </div>

      {/* Detail Panel */}
      <div className="w-[400px] bg-white rounded-3xl border border-slate-100 p-8 shadow-sm h-fit sticky top-0">
        {selectedK ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">Detail Laporan</h2>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${
                  selectedK.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 
                  selectedK.status === 'Proses' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedK.status.toUpperCase()}
                </div>
              </div>
              <button onClick={() => handleDelete(selectedK.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                <Trash2 size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {!selectedK.isValidated && (
                <button
                  onClick={handleValidate}
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
                >
                  <ShieldCheck size={20} />
                  <span>Validasi Laporan Ini</span>
                </button>
              )}

              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Deskripsi Laporan</p>
                <p className="text-slate-700 text-sm leading-relaxed font-bold">{selectedK.deskripsi}</p>
              </div>
            </div>

            {selectedK.isValidated ? (
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-slate-800">Tindak Lanjut (Hanya untuk Laporan Valid)</h4>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => handleUpdateStatus('Proses')}
                    className={`flex items-center justify-center space-x-2 py-3 rounded-xl border-2 transition-all font-semibold ${
                      selectedK.status === 'Proses' ? 'bg-amber-500 text-white border-amber-500 shadow-lg' : 'border-slate-100 text-slate-400 hover:border-amber-300'
                    }`}
                  >
                    <Clock size={18} />
                    <span>Sedang Diproses</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('Selesai')}
                    className={`flex items-center justify-center space-x-2 py-3 rounded-xl border-2 transition-all font-semibold ${
                      selectedK.status === 'Selesai' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'border-slate-100 text-slate-400 hover:border-emerald-300'
                    }`}
                  >
                    <CheckCircle2 size={18} />
                    <span>Selesai Dikerjakan</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-3 text-amber-700">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-[11px] font-medium leading-relaxed">
                  Laporan ini belum divalidasi oleh Admin. Silakan klik tombol <strong>Validasi</strong> di atas untuk dapat memproses tindak lanjut.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-400">
            <MessageSquare size={48} className="mb-4 opacity-10" />
            <p className="text-sm">Pilih laporan untuk melihat detail dan validasi.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsAdmin;
