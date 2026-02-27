
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Keluhan, KategoriPelapor } from '../types';
import { Brush, Wrench, Send, ArrowRight, MonitorDot, CheckCircle2, MessageCircle, UserCog, User, Briefcase, AlertTriangle, Info, Building2, Sofa, Monitor } from 'lucide-react';

interface PublicKeluhanProps {
  onAdd: (k: Keluhan) => void;
  existingKeluhans: Keluhan[];
}

const PublicKeluhan: React.FC<PublicKeluhanProps> = ({ onAdd, existingKeluhans }) => {
  const [step, setStep] = useState<'selection' | 'form' | 'success'>('selection');
  const [category, setCategory] = useState<'Kebersihan' | 'Perbaikan' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    pelapor: '',
    kategoriPelapor: 'Pihak' as KategoriPelapor,
    lokasi: '',
    deskripsi: '',
    subKategori: ''
  });
  const [waLink, setWaLink] = useState('');

  const isDuplicate = () => {
    const today = new Date().toISOString().split('T')[0];
    return existingKeluhans.some(k => 
      k.kategori === category &&
      k.lokasi.toLowerCase().trim() === formData.lokasi.toLowerCase().trim() &&
      k.deskripsi.toLowerCase().trim() === formData.deskripsi.toLowerCase().trim() &&
      k.tanggal.split('T')[0] === today
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!category) return;

    if (category === 'Perbaikan' && !formData.subKategori) {
      setError("Silakan pilih kriteria perbaikan terlebih dahulu.");
      return;
    }

    // Filter BANNED_WORDS dihapus sesuai permintaan agar semua laporan masuk untuk validasi manual
    
    if (isDuplicate()) {
      setError("Laporan yang sama sudah dikirimkan hari ini. Mohon tunggu tindak lanjut petugas.");
      return;
    }

    const newComplaint: Keluhan = {
      id: Math.random().toString(36).substr(2, 9),
      tanggal: new Date().toISOString(),
      kategori: category,
      subKategori: formData.subKategori,
      kategoriPelapor: formData.kategoriPelapor,
      pelapor: formData.pelapor,
      lokasi: formData.lokasi,
      deskripsi: formData.deskripsi,
      status: 'Menunggu'
    };

    onAdd(newComplaint);
    
    // PIC Logic
    let waNumber = '';
    let picName = '';

    if (category === 'Kebersihan') {
      waNumber = '6282186726057';
      picName = 'Bpk. Malik';
    } else if (category === 'Perbaikan') {
      if (formData.subKategori === 'Gedung') {
        waNumber = '6288286733662'; // Aprianson
        picName = 'Bpk. Aprianson';
      } else {
        waNumber = '6285367086256'; // Oktario
        picName = 'Bpk. Oktario';
      }
    }
    
    const message = `*DIGIMONS - LAPORAN BARU*\n\n` +
      `Halo ${picName},\n` +
      `Ada laporan masuk melalui sistem DIGIMONS:\n\n` +
      `*Kategori:* ${category}${formData.subKategori ? ` (${formData.subKategori})` : ''}\n` +
      `*Jenis Pelapor:* ${formData.kategoriPelapor}\n` +
      `*Nama Pelapor:* ${formData.pelapor}\n` +
      `*Lokasi:* ${formData.lokasi}\n` +
      `*Keterangan:* ${formData.deskripsi}\n\n` +
      `_Mohon segera dilakukan pengecekan. Terima kasih._`;
      
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    
    setWaLink(waUrl);
    setStep('success');
  };

  const resetForm = () => {
    setStep('selection');
    setFormData({ pelapor: '', kategoriPelapor: 'Pihak', lokasi: '', deskripsi: '', subKategori: '' });
    setCategory(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-12 animate-in fade-in duration-700">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-3xl mb-6 shadow-sm">
          <MonitorDot className="w-12 h-12 text-emerald-800" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">DIGIMONS</h1>
        <p className="text-slate-500 mt-2 text-lg font-medium">Digital Monitoring Sarana & Prasarana</p>
        <p className="text-slate-400 text-sm italic">Pengadilan Agama Prabumulih</p>
      </div>

      {step === 'selection' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <button
            onClick={() => { setCategory('Kebersihan'); setStep('form'); }}
            className="group p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-100 transition-all text-left"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <Brush size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Keluhan Kebersihan</h3>
            <p className="text-slate-500 mt-2">Laporkan ruangan yang kotor, toilet bermasalah, atau tumpukan sampah.</p>
            <div className="mt-8 flex items-center text-emerald-600 font-bold group-hover:translate-x-2 transition-transform">
              Kirim Laporan <ArrowRight size={20} className="ml-2" />
            </div>
          </button>

          <button
            onClick={() => { setCategory('Perbaikan'); setStep('form'); }}
            className="group p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-100 transition-all text-left"
          >
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:bg-amber-800 group-hover:text-white transition-all duration-300">
              <Wrench size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Mohon Perbaikan</h3>
            <p className="text-slate-500 mt-2">Permintaan perbaikan AC, Laptop, Meja, Kursi, atau fasilitas rusak lainnya.</p>
            <div className="mt-8 flex items-center text-amber-600 font-bold group-hover:translate-x-2 transition-transform">
              Ajukan Perbaikan <ArrowRight size={20} className="ml-2" />
            </div>
          </button>
        </div>
      )}

      {step === 'form' && (
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto w-full">
          <button onClick={() => { setStep('selection'); setError(null); }} className="text-sm font-semibold text-slate-400 hover:text-emerald-700 mb-8 flex items-center transition-colors">
            <ArrowRight size={16} className="rotate-180 mr-2" /> Kembali Pilih Kategori
          </button>
          
          <div className="flex items-center space-x-4 mb-10">
            <div className={`p-4 rounded-2xl ${category === 'Kebersihan' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {category === 'Kebersihan' ? <Brush size={28} /> : <Wrench size={28} />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Form Laporan {category}</h2>
              <p className="text-slate-400 text-sm italic">Admin akan memvalidasi laporan Anda secara manual.</p>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3 text-red-700 animate-in fade-in">
              <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {category === 'Perbaikan' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center">
                  <Info size={12} className="mr-1.5" /> Pilih Kriteria Perbaikan
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, subKategori: 'Gedung' })}
                    className={`flex items-start p-4 rounded-2xl border-2 transition-all text-left space-x-3 ${
                      formData.subKategori === 'Gedung' ? 'bg-amber-50 border-amber-500 shadow-sm' : 'bg-white border-slate-100'
                    }`}
                  >
                    <Building2 className={`shrink-0 mt-1 ${formData.subKategori === 'Gedung' ? 'text-amber-600' : 'text-slate-300'}`} />
                    <div>
                      <p className={`font-bold text-sm ${formData.subKategori === 'Gedung' ? 'text-amber-900' : 'text-slate-600'}`}>Gedung</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Contoh : Lantai, Lampu, Kran Air, AC, dll</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, subKategori: 'Peralatan Non TIK' })}
                    className={`flex items-start p-4 rounded-2xl border-2 transition-all text-left space-x-3 ${
                      formData.subKategori === 'Peralatan Non TIK' ? 'bg-amber-50 border-amber-500 shadow-sm' : 'bg-white border-slate-100'
                    }`}
                  >
                    <Sofa className={`shrink-0 mt-1 ${formData.subKategori === 'Peralatan Non TIK' ? 'text-amber-600' : 'text-slate-300'}`} />
                    <div>
                      <p className={`font-bold text-sm ${formData.subKategori === 'Peralatan Non TIK' ? 'text-amber-900' : 'text-slate-600'}`}>Peralatan Non TIK</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Contoh : Kursi, Meja, Dispenser, dll</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, subKategori: 'Peralatan TIK' })}
                    className={`flex items-start p-4 rounded-2xl border-2 transition-all text-left space-x-3 ${
                      formData.subKategori === 'Peralatan TIK' ? 'bg-amber-50 border-amber-500 shadow-sm' : 'bg-white border-slate-100'
                    }`}
                  >
                    <Monitor className={`shrink-0 mt-1 ${formData.subKategori === 'Peralatan TIK' ? 'text-amber-600' : 'text-slate-300'}`} />
                    <div>
                      <p className={`font-bold text-sm ${formData.subKategori === 'Peralatan TIK' ? 'text-amber-900' : 'text-slate-600'}`}>Peralatan TIK</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Contoh: PC, Laptop, Printer, Router, dll</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Kategori Pelapor</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, kategoriPelapor: 'Pegawai' })}
                  className={`flex items-center justify-center space-x-2 py-4 rounded-2xl border-2 transition-all ${
                    formData.kategoriPelapor === 'Pegawai' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm' : 'bg-white border-slate-100 text-slate-400'
                  }`}
                >
                  <Briefcase size={20} />
                  <span className="font-bold">Pegawai</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, kategoriPelapor: 'Pihak' })}
                  className={`flex items-center justify-center space-x-2 py-4 rounded-2xl border-2 transition-all ${
                    formData.kategoriPelapor === 'Pihak' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm' : 'bg-white border-slate-100 text-slate-400'
                  }`}
                >
                  <User size={20} />
                  <span className="font-bold">Pihak</span>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nama Pelapor</label>
              <input
                required
                type="text"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                placeholder="Nama Anda"
                value={formData.pelapor}
                onChange={e => setFormData({ ...formData, pelapor: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Lokasi Kejadian</label>
              <input
                required
                type="text"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                placeholder="Contoh: Ruang PTSP, Toilet F2"
                value={formData.lokasi}
                onChange={e => setFormData({ ...formData, lokasi: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Keterangan Detail</label>
              <textarea
                required
                rows={4}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none"
                placeholder="Ceritakan masalah yang ditemukan secara jelas..."
                value={formData.deskripsi}
                onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-5 rounded-2xl font-bold text-white flex items-center justify-center space-x-2 transition-all shadow-xl ${
                category === 'Kebersihan' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
              }`}
            >
              <Send size={20} />
              <span>Kirim Laporan DIGIMONS</span>
            </button>
          </form>
        </div>
      )}

      {step === 'success' && (
        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-500 text-center max-w-xl mx-auto w-full">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 size={56} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Laporan Diterima!</h2>
          <p className="text-slate-500 mb-10">Laporan Anda telah masuk ke sistem monitoring internal untuk divalidasi oleh Admin.</p>
          
          <div className="flex flex-col space-y-4">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center space-x-3 shadow-lg transition-all"
            >
              <MessageCircle size={22} />
              <span>Notifikasi WhatsApp Petugas</span>
            </a>
            <button
              onClick={resetForm}
              className="w-full py-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
            >
              Selesai & Kembali
            </button>
          </div>
        </div>
      )}

      <div className="mt-16 text-center">
        <Link to="/login" className="inline-flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-emerald-800 text-sm font-bold transition-all">
          <UserCog size={18} />
          <span>Halaman Pegawai</span>
        </Link>
      </div>
    </div>
  );
};

export default PublicKeluhan;
