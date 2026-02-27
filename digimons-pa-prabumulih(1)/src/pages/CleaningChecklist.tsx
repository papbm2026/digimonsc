
import React, { useState, useMemo } from 'react';
import { User, CleaningLog } from '../types';
import { ROOMS_F1, ROOMS_F2, ROOM_ASSIGNMENTS } from '../constants';
import { Brush, Check, X, Printer, Calendar, Plus, Square, CheckSquare, Droplets, Trash2, Wind, Sparkles, Layout, Monitor, Layers, Coffee, Utensils, Refrigerator, ShieldCheck } from 'lucide-react';

interface Props {
  user: User;
  logs: CleaningLog[];
  onAdd: (log: CleaningLog) => void;
  onDelete: (id: string) => void;
}

const ROOMS_WITH_GALON = ['Tunggu Sidang', 'Ruang PTSP', 'Kepaniteraan', 'Ruang Ketua', 'Wakil Ketua', 'Ruang Hakim 1', 'Kesekretariatan', 'Panitera', 'Sekretaris', 'Panitera Pengganti'];
const ROOMS_WITH_PRIVATE_TOILET = ['Ruang Ketua', 'Wakil Ketua', 'Ruang Hakim 1', 'Hakim 2', 'Sekretaris', 'Panitera'];

const STANDARD_TASKS = [
  { id: 'lantai', label: 'Lantai sudah disapu dan dipel', icon: <Brush size={16} /> },
  { id: 'langit', label: 'Langit-langit bersih dari sawang laba-laba', icon: <Layers size={16} /> },
  { id: 'tata_ruang', label: 'Tata ruang dan barang sudah rapi', icon: <Layout size={16} /> },
  { id: 'sampah', label: 'Tempat sampah dikosongkan', icon: <Trash2 size={16} /> },
  { id: 'meja', label: 'Meja sudah dilap', icon: <Monitor size={16} /> },
  { id: 'kaca', label: 'Kaca pintu & jendela dibersihkan (1x seminggu)', icon: <Sparkles size={16} /> },
  { id: 'pengharum', label: 'Ruangan sudah diberi pengharum', icon: <Wind size={16} /> }
];

const GALON_TASK = { id: 'galon_std', label: 'Galon ada/sudah terisi', icon: <Droplets size={16} /> };
const TOILET_CLEAN_TASK = { id: 'toilet_pribadi', label: 'Toilet sudah dibersihkan', icon: <Sparkles size={16} /> };

const TOILET_TASKS = [
  { id: 'lantai_toilet', label: 'Lantai Bersih & Tidak Licin', icon: <Brush size={16} /> },
  { id: 'kloset', label: 'Kloset/Urinal Bersih (Tidak Berkerak)', icon: <Droplets size={16} /> },
  { id: 'wastafel', label: 'Wastafel & Cermin Bersih', icon: <Sparkles size={16} /> },
  { id: 'stok', label: 'Air/Sabun/Tisu Tersedia Cukup', icon: <Droplets size={16} /> },
  { id: 'bak_air', label: 'Bak penampung air bersih', icon: <Droplets size={16} /> },
  { id: 'pengharum_toilet', label: 'Toilet diberi pengharum/kamper', icon: <Wind size={16} /> },
  { id: 'sampah_toilet', label: 'Tempat sampah sudah dikosongkan', icon: <Trash2 size={16} /> }
];

const GENERAL_AREA_TASKS = [
  { id: 'lantai', label: 'Lantai sudah disapu dan dipel', icon: <Brush size={16} /> },
  { id: 'langit', label: 'Langit-langit bersih dari sawang laba-laba', icon: <Layers size={16} /> },
  { id: 'sampah', label: 'Tempat sampah dikosongkan', icon: <Trash2 size={16} /> },
  { id: 'pengharum', label: 'Sudah diberi pengharum', icon: <Wind size={16} /> }
];

const ROOFTOP_TASKS = [
  { id: 'lantai_rt', label: 'Lantai sudah disapu dan bersih', icon: <Brush size={16} /> },
  { id: 'meja_kursi_rt', label: 'Meja dan kursi sudah dilap', icon: <Monitor size={16} /> },
  { id: 'sampah_rt', label: 'Tempat sampah dikosongkan', icon: <Trash2 size={16} /> },
  { id: 'tata_barang_rt', label: 'Barang-barang tertata rapi', icon: <Layout size={16} /> },
  { id: 'cucian_rt', label: 'Piring dan gelas kotor sudah dicuci', icon: <Utensils size={16} /> },
  { id: 'kulkas_rt', label: 'Kulkas bersih', icon: <Refrigerator size={16} /> },
  { id: 'galon_rt', label: 'Galon sudah terisi', icon: <Droplets size={16} /> }
];

const CleaningChecklist: React.FC<Props> = ({ user, logs, onAdd, onDelete }) => {
  const [data, setData] = useState<CleaningLog[]>(logs);
  const [selectedLantai, setSelectedLantai] = useState<1 | 2>(1);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [catatan, setCatatan] = useState('');
  const [inputTanggal, setInputTanggal] = useState(() => new Date().toISOString().split('T')[0]);
  const [viewDate, setViewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [reportMonth, setReportMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const isAdmin = user.username === 'PAPrabumulih';

  const isToilet = (roomName: string) => roomName.toLowerCase().includes('toilet');
  const isGeneralArea = (roomName: string) => 
    (roomName.toLowerCase().includes('corridor') || 
    roomName.toLowerCase().includes('tangga')) && 
    !roomName.toLowerCase().includes('rooftop');

  const currentTasks = useMemo(() => {
    if (selectedRoom === 'Rooftop') return ROOFTOP_TASKS;
    if (isToilet(selectedRoom)) return TOILET_TASKS;
    if (isGeneralArea(selectedRoom)) return GENERAL_AREA_TASKS;
    let baseTasks = [...STANDARD_TASKS];
    if (selectedRoom === 'Kolam') {
      baseTasks = baseTasks.map(task => task.id === 'meja' ? { ...task, label: 'Kursi sudah dilap' } : task);
    }
    if (ROOMS_WITH_GALON.includes(selectedRoom)) baseTasks.push(GALON_TASK);
    if (ROOMS_WITH_PRIVATE_TOILET.includes(selectedRoom)) baseTasks.push(TOILET_CLEAN_TASK);
    return baseTasks;
  }, [selectedRoom]);

  const rooms = selectedLantai === 1 ? ROOMS_F1 : ROOMS_F2;
  const today = new Date().toISOString().split('T')[0];
  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 20);
    return d.toISOString().split('T')[0];
  }, []);

  const todayLogs = useMemo(() => data.filter(l => l.tanggal === today), [data, today]);
  const filteredLogs = useMemo(() => 
    data.filter(l => l.tanggal === viewDate)
  , [data, viewDate]);

  const roomsDone = useMemo(() => todayLogs.map(l => l.ruangan), [todayLogs]);

  // Logic for Printing Matrix
  const daysInMonth = useMemo(() => {
    const [year, month] = reportMonth.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  }, [reportMonth]);

  const validatedMonthlyLogs = useMemo(() => {
    return data.filter(l => l.tanggal.startsWith(reportMonth));
  }, [data, reportMonth]);

  const matrixData = useMemo(() => {
    const allRooms = Object.keys(ROOM_ASSIGNMENTS);
    return allRooms.map(room => {
      const roomLogs = validatedMonthlyLogs.filter(l => l.ruangan === room);
      const statuses: Record<number, 'V' | 'X' | '-'> = {};
      
      for (let i = 1; i <= daysInMonth; i++) {
        const dayStr = String(i).padStart(2, '0');
        const log = roomLogs.find(l => l.tanggal.endsWith(`-${dayStr}`));
        if (log) {
          statuses[i] = log.isClean ? 'V' : 'X';
        } else {
          statuses[i] = '-';
        }
      }

      const notes = roomLogs
        .map(l => l.catatan)
        .filter(c => c && c !== 'Kondisi Bersih' && c !== 'Kurang Bersih');
      
      const compiledNotes = Array.from(new Set(notes)).join('; ');

      return {
        room,
        petugas: ROOM_ASSIGNMENTS[room].pic,
        statuses,
        compiledNotes
      };
    });
  }, [validatedMonthlyLogs, daysInMonth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      tanggal: inputTanggal,
      lantai: selectedLantai,
      ruangan: selectedRoom,
      picPetugas: ROOM_ASSIGNMENTS[selectedRoom]?.pic || '-',
      petugasChecklist: user.name,
      isClean: completedTasks.length === currentTasks.length,
      catatan: catatan || (completedTasks.length === currentTasks.length ? 'Kondisi Bersih' : 'Kurang Bersih'),
      isValidated: false
    };
    onAdd(newLog);
    setData([newLog, ...data]);
    setSelectedRoom('');
    setCatatan('');
    setCompletedTasks([]);
    setShowForm(false);
  };

  const handleValidate = (id: string) => {
    // Validation feature removed as per user request
  };

  const handleDelete = (id: string) => {
    window.alert('Delete function triggered for ID: ' + id);
    setData(data.filter(item => item.id !== id));
    console.log('Successfully deleted ID:', id);
    onDelete(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Checklist Kebersihan</h1>
          <p className="text-slate-500">Monitoring oleh: {user.name} {isAdmin && <span className="text-emerald-600 font-bold">(Validator)</span>}</p>
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
                  className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  Bulan Lalu
                </button>
                <button 
                  onClick={() => {
                    const d = new Date();
                    setReportMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
                  }}
                  className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  Bulan Ini
                </button>
              </div>
              <input type="month" className="px-2 py-1.5 text-xs font-bold text-slate-600 outline-none" value={reportMonth} onChange={(e) => setReportMonth(e.target.value)} />
              <button onClick={() => window.print()} className="flex items-center space-x-2 px-3 py-2 text-emerald-600 hover:bg-emerald-50 border-l">
                <Printer size={18} />
                <span className="text-xs font-bold">Cetak Rekap</span>
              </button>
            </div>
          )}
          <button onClick={() => setShowForm(!showForm)} className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all">
            {showForm ? <X size={18} /> : <Plus size={18} />}
            <span>{showForm ? 'Batal' : 'Input Checklist'}</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 no-print">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tanggal Pelaporan</label>
                <input 
                  required 
                  type="date" 
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white outline-none" 
                  value={inputTanggal} 
                  onChange={e => setInputTanggal(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Pilih Lantai</label>
                <div className="flex p-1 bg-slate-100 rounded-2xl">
                  {[1, 2].map(l => (
                    <button key={l} type="button" onClick={() => { setSelectedLantai(l as 1 | 2); setSelectedRoom(''); setCompletedTasks([]); }} className={`flex-1 py-2 text-xs font-bold rounded-xl ${selectedLantai === l ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-400'}`}>Lantai {l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Pilih Ruangan</label>
                <select required className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white outline-none" value={selectedRoom} onChange={e => { setSelectedRoom(e.target.value); setCompletedTasks([]); }}>
                  <option value="">-- Pilih Ruangan --</option>
                  {rooms.map(r => <option key={r} value={r} disabled={roomsDone.includes(r)}>{r} {roomsDone.includes(r) ? '(Selesai)' : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">PIC Petugas</label>
                <div className="w-full px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold">{selectedRoom ? ROOM_ASSIGNMENTS[selectedRoom]?.pic : '-'}</div>
              </div>
            </div>

            {selectedRoom && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentTasks.map(task => (
                  <button key={task.id} type="button" onClick={() => setCompletedTasks(prev => prev.includes(task.id) ? prev.filter(id => id !== task.id) : [...prev, task.id])} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${completedTasks.includes(task.id) ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm' : 'bg-white border-slate-100 text-slate-400'}`}>
                    <div className="flex items-center space-x-3 text-left">
                      <div className={completedTasks.includes(task.id) ? 'text-emerald-600' : 'text-slate-300'}>{task.icon}</div>
                      <span className="font-semibold text-xs leading-tight">{task.label}</span>
                    </div>
                    {completedTasks.includes(task.id) ? <CheckSquare className="text-emerald-600" /> : <Square />}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Catatan</label>
                <input type="text" className="w-full px-4 py-4 rounded-2xl bg-slate-50 border outline-none" value={catatan} onChange={e => setCatatan(e.target.value)} placeholder="Kendala/Temuan..." />
              </div>
              <button type="submit" disabled={!selectedRoom} className={`w-full py-4 rounded-2xl font-bold transition-all shadow-xl ${!selectedRoom ? 'bg-slate-100 text-slate-400' : 'bg-emerald-800 text-white shadow-emerald-200'}`}>Simpan Checklist</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden no-print">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center"><Calendar size={18} className="mr-2 text-emerald-600" /> Log Monitoring</h3>
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
            <thead>
              <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Ruangan</th>
                <th className="px-6 py-4">Status & Validasi</th>
                <th className="px-6 py-4">Pemeriksa</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms.map(room => {
                const log = filteredLogs.find(l => l.ruangan === room);
                return (
                  <tr key={room} className="group hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-700 text-sm">{room}</p>
                      <p className="text-[10px] text-slate-400">{ROOM_ASSIGNMENTS[room]?.pic}</p>
                    </td>
                    <td className="px-6 py-4">
                      {log ? (
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold w-fit ${log.isClean ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                            {log.isClean ? 'BERSIH' : 'KURANG BERSIH'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-200 text-[10px] font-bold italic">BELUM DICEK</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">{log?.petugasChecklist || '-'}</td>
                    <td className="px-6 py-4">
                      {log && isAdmin && (
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleDelete(log.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors" title="Hapus">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MATRIX RECAP FOR PRINTING */}
      <div className="print-only p-4">
        <div className="text-center mb-6 border-b-2 border-black pb-4">
          <h1 className="text-xl font-bold uppercase">Rekapitulasi Checklist Kebersihan Bulanan (DIGIMONS)</h1>
          <h2 className="text-lg font-bold">PENGADILAN AGAMA PRABUMULIH</h2>
          <p className="text-[10px] mt-1 italic uppercase tracking-wider">
            Periode: {new Date(reportMonth + "-01").toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        
        <table className="w-full border-collapse border border-black text-[7px]">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-black p-1 text-left w-32" rowSpan={2}>Nama Ruangan</th>
              <th className="border border-black p-1 text-left w-20" rowSpan={2}>Petugas</th>
              <th className="border border-black p-1 text-center" colSpan={daysInMonth}>Tanggal</th>
              <th className="border border-black p-1 text-left" rowSpan={2}>Kompilasi Catatan / Temuan</th>
            </tr>
            <tr className="bg-slate-50">
              {Array.from({ length: daysInMonth }).map((_, i) => (
                <th key={i} className="border border-black p-0.5 text-center w-4">{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrixData.map((data, idx) => (
              <tr key={idx}>
                <td className="border border-black px-1 py-0.5 font-bold">{data.room}</td>
                <td className="border border-black px-1 py-0.5">{data.petugas}</td>
                {Array.from({ length: daysInMonth }).map((_, i) => (
                  <td key={i} className={`border border-black p-0.5 text-center font-bold ${data.statuses[i+1] === 'X' ? 'text-red-600 bg-red-50' : ''}`}>
                    {data.statuses[i + 1]}
                  </td>
                ))}
                <td className="border border-black px-1 py-0.5 italic max-w-xs">{data.compiledNotes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 text-[8px] grid grid-cols-2 text-center gap-10">
          <div className="space-y-12">
            <div>
              <p className="font-bold">Teknisi Sarana dan Prasarana,</p>
              <div className="h-14"></div>
              <p className="font-bold underline text-[9px]">([Nama-Pegawai])</p>
              <p>NIP. ([NIP_Pegawai])</p>
            </div>
            <div>
              <p className="font-bold">Petugas Checklist 1,</p>
              <div className="h-14"></div>
              <p className="font-bold underline text-[9px]">([Nama-Pegawai])</p>
              <p>NIP. ([NIP_Pegawai])</p>
            </div>
          </div>
          <div className="space-y-12">
            <div>
              <p>Prabumulih, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
              <p className="font-bold">Kasubbag Umum & Keuangan,</p>
              <div className="h-14"></div>
              <p className="font-bold underline text-[9px]">([Nama-Pegawai])</p>
              <p>NIP. ([NIP_Pegawai])</p>
            </div>
            <div>
              <p className="font-bold">Petugas Checklist 2,</p>
              <div className="h-14"></div>
              <p className="font-bold underline text-[9px]">([Nama-Pegawai])</p>
              <p>NIP. ([NIP_Pegawai])</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-[8px]">
           <p className="font-bold">Mengetahui,</p>
           <p className="font-bold uppercase">Sekretaris Pengadilan Agama Prabumulih</p>
           <div className="h-16"></div>
           <p className="font-bold underline text-[9px]">([Nama-Pegawai])</p>
           <p>NIP. ([NIP_Pegawai])</p>
        </div>

        <div className="mt-4 text-[6px] text-slate-400">
          Keterangan: V = Bersih, X = Kurang Bersih, - = Belum Dicek / Libur
        </div>
      </div>
    </div>
  );
};

export default CleaningChecklist;
