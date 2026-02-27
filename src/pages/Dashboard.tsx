
import React, { useMemo, useState } from 'react';
import { Keluhan, CleaningLog, MaintenanceLog, SecurityLog } from '../types';
import { ROOMS_F1, ROOMS_F2 } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line } from 'recharts';
import { AlertCircle, CheckCircle2, Clock, Shield, Activity, Calendar, MessageSquare, Wrench, Briefcase, User, Car, Bike, AlertTriangle, TrendingUp } from 'lucide-react';

interface DashboardProps {
  keluhans: Keluhan[];
  cleaning: CleaningLog[];
  maintenance: MaintenanceLog[];
  security: SecurityLog[];
}

interface VehicleTax {
  name: string;
  plate: string;
  type: 'motor' | 'mobil';
  dueMonth: number; // 1-12
  dueDate: number;
}

const VEHICLES: VehicleTax[] = [
  { name: 'Yamaha Aerox', plate: 'BG 5916 CZ', type: 'motor', dueMonth: 7, dueDate: 19 },
  { name: 'Yamaha Aerox', plate: 'BG 5917 CZ', type: 'motor', dueMonth: 7, dueDate: 19 },
  { name: 'Toyota Rush', plate: 'BG 1184 CZ', type: 'mobil', dueMonth: 6, dueDate: 27 },
  { name: 'Toyota Fortuner', plate: 'BG 1263 CZ', type: 'mobil', dueMonth: 9, dueDate: 15 },
  { name: 'Mitsubishi Pajero', plate: 'BG 1266 CZ', type: 'mobil', dueMonth: 11, dueDate: 27 },
];

const Dashboard: React.FC<DashboardProps> = ({ keluhans, cleaning, maintenance, security }) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Date filtering logic
  const [selectedDate, setSelectedDate] = useState(todayStr);
  
  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 20);
    return d.toISOString().split('T')[0];
  }, []);

  // Stats filtered by selected date
  const pendingComplaints = useMemo(() => 
    keluhans.filter(k => k.tanggal.split('T')[0] <= selectedDate && k.status === 'Menunggu').length
  , [keluhans, selectedDate]);

  const selectedCleaning = useMemo(() => 
    cleaning.filter(c => c.tanggal === selectedDate).length
  , [cleaning, selectedDate]);

  const totalRooms = ROOMS_F1.length + ROOMS_F2.length;
  const cleaningProgress = Math.round((selectedCleaning / totalRooms) * 100) || 0;
  
  const filteredMaintenance = useMemo(() => 
    maintenance.filter(m => m.tanggal <= selectedDate)
  , [maintenance, selectedDate]);

  const filteredSecurity = useMemo(() => 
    security.filter(s => s.tanggal <= selectedDate)
  , [security, selectedDate]);

  const lastSecurity = filteredSecurity[0];

  // Trend Data (Last 20 days)
  const trendData = useMemo(() => {
    const data = [];
    for (let i = 20; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const count = cleaning.filter(c => c.tanggal === dStr).length;
      data.push({
        date: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        count: count,
        progress: Math.round((count / totalRooms) * 100)
      });
    }
    return data;
  }, [cleaning, totalRooms]);

  // Logic for Vehicle Tax Monitoring
  const vehicleStatus = useMemo(() => {
    return VEHICLES.map(v => {
      const currentYear = today.getFullYear();
      let dueThisYear = new Date(currentYear, v.dueMonth - 1, v.dueDate);
      
      // If already passed this year, look for next year
      if (today > dueThisYear) {
        dueThisYear = new Date(currentYear + 1, v.dueMonth - 1, v.dueDate);
      }

      const diffTime = dueThisYear.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        ...v,
        daysLeft: diffDays,
        fullDate: dueThisYear.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' }),
        isUrgent: diffDays <= 20
      };
    }).sort((a, b) => a.daysLeft - b.daysLeft);
  }, [today]);

  // Data for Charts
  const complaintData = [
    { name: 'Menunggu', value: keluhans.filter(k => k.status === 'Menunggu').length, color: '#ef4444' },
    { name: 'Proses', value: keluhans.filter(k => k.status === 'Proses').length, color: '#f59e0b' },
    { name: 'Selesai', value: keluhans.filter(k => k.status === 'Selesai').length, color: '#10b981' },
  ];

  const maintenanceStats = [
    { name: 'Gedung', count: filteredMaintenance.filter(m => m.item === 'Gedung').length },
    { name: 'Halaman', count: filteredMaintenance.filter(m => m.item === 'Halaman').length },
    { name: 'IT', count: filteredMaintenance.filter(m => ['PC', 'Laptop', 'Printer'].includes(m.item)).length },
    { name: 'AC', count: filteredMaintenance.filter(m => m.item === 'AC').length },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Monitoring Panel</h1>
          <p className="text-slate-500">Overview performa sarana & prasarana hari ini</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-3 text-emerald-700 font-medium">
            <Calendar size={18} className="text-emerald-600" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold leading-none mb-1">Filter Tanggal (Maks H-20)</span>
              <input 
                type="date" 
                min={minDate}
                max={todayStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-sm font-bold bg-transparent outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Keluhan Baru</p>
            <h3 className="text-3xl font-bold mt-1">{pendingComplaints}</h3>
            <p className="text-xs text-red-500 mt-2 flex items-center">
              <AlertCircle size={12} className="mr-1" /> Membutuhkan tindak lanjut
            </p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Kebersihan Ruangan</p>
            <h3 className="text-3xl font-bold mt-1">{cleaningProgress}%</h3>
            <p className="text-xs text-emerald-500 mt-2 flex items-center">
              <CheckCircle2 size={12} className="mr-1" /> {selectedCleaning} dari {totalRooms} ruangan
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Activity size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Pemeliharaan Terakhir</p>
            <h3 className="text-lg font-bold mt-1 truncate max-w-[140px]">{filteredMaintenance[0]?.item || 'Belum ada'}</h3>
            <p className="text-xs text-slate-400 mt-2 italic">{filteredMaintenance[0]?.tanggal || '-'}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Wrench size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Status Keamanan</p>
            <h3 className="text-lg font-bold mt-1">
              Shift {lastSecurity?.shift || '-'}
            </h3>
            <p className="text-xs text-blue-500 mt-2 flex items-center">
              <CheckCircle2 size={12} className="mr-1" /> Terlaporkan: {lastSecurity?.petugas || 'N/A'}
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Shield size={24} />
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-bold text-slate-800 flex items-center">
            <TrendingUp size={18} className="mr-2 text-emerald-600" />
            Tren Kebersihan (20 Hari Terakhir)
          </h4>
        </div>
        <div style={{ height: '400px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                interval={2}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`${value}%`, 'Progres']}
              />
              <Line 
                type="monotone" 
                dataKey="progress" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vehicle Tax Monitoring Section */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="font-bold text-slate-800 flex items-center text-lg">
              <Car size={20} className="mr-3 text-emerald-600" />
              Monitoring Pajak Kendaraan Dinas
            </h4>
            <p className="text-sm text-slate-500 mt-1">Status jatuh tempo pajak tahunan</p>
          </div>
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
             <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">H-20 Alert Active</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {vehicleStatus.map((v) => (
            <div 
              key={v.plate}
              className={`p-5 rounded-3xl border-2 transition-all duration-300 ${
                v.isUrgent 
                ? 'bg-red-50 border-red-200 shadow-lg shadow-red-100 scale-105 z-10' 
                : 'bg-white border-slate-50 hover:border-emerald-100'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl ${v.isUrgent ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {v.type === 'mobil' ? <Car size={20} /> : <Bike size={20} />}
                </div>
                {v.isUrgent && (
                  <span className="flex items-center text-[10px] font-bold text-red-600 animate-bounce">
                    <AlertTriangle size={12} className="mr-1" /> SEGERA
                  </span>
                )}
              </div>
              <h5 className="font-bold text-slate-800 text-sm leading-tight">{v.name}</h5>
              <p className="text-[11px] font-bold text-slate-400 tracking-wider mb-3">{v.plate}</p>
              
              <div className="space-y-1 mt-auto">
                <p className={`text-[10px] font-medium ${v.isUrgent ? 'text-red-500' : 'text-slate-400'}`}>Jatuh Tempo:</p>
                <p className={`text-xs font-bold ${v.isUrgent ? 'text-red-700' : 'text-slate-700'}`}>{v.fullDate}</p>
                <div className={`mt-2 inline-block px-2 py-0.5 rounded-lg text-[9px] font-bold ${v.isUrgent ? 'bg-red-600 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
                  {v.daysLeft} Hari Lagi
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-6 flex items-center">
            <MessageSquare size={18} className="mr-2 text-emerald-600" />
            Status Keluhan & Saran
          </h4>
          <div style={{ height: '400px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complaintData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {complaintData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {complaintData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-slate-500">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-6 flex items-center">
            <Wrench size={18} className="mr-2 text-amber-600" />
            Realisasi Pemeliharaan per Kategori
          </h4>
          <div style={{ height: '400px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h4 className="font-bold text-slate-800 mb-6">Aktivitas Terkini</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                <th className="pb-4 font-semibold">Waktu</th>
                <th className="pb-4 font-semibold">Kategori</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold">Detail</th>
                <th className="pb-4 font-semibold">Pelapor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {keluhans.slice(0, 10).map((k) => (
                <tr key={k.id} className="text-sm">
                  <td className="py-4 text-slate-500 whitespace-nowrap">
                    {new Date(k.tanggal).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase w-fit ${
                        k.kategori === 'Kebersihan' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {k.kategori === 'Kebersihan' ? 'Kebersihan' : 'Mohon Perbaikan'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase w-fit flex items-center ${
                        k.kategoriPelapor === 'Pegawai' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-600'
                      }`}>
                        {k.kategoriPelapor === 'Pegawai' ? <Briefcase size={8} className="mr-1" /> : <User size={8} className="mr-1" />}
                        {k.kategoriPelapor}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-bold ${
                      k.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 
                      k.status === 'Proses' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {k.status === 'Selesai' ? <CheckCircle2 size={10} className="mr-1" /> : 
                       k.status === 'Proses' ? <Clock size={10} className="mr-1" /> : <AlertCircle size={10} className="mr-1" />}
                      {k.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 font-medium text-slate-700 max-w-xs truncate">{k.deskripsi}</td>
                  <td className="py-4 text-slate-600 font-bold">{k.pelapor}</td>
                </tr>
              ))}
              {keluhans.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 italic text-sm">Belum ada aktivitas laporan terbaru</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
