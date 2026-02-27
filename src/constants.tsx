
import React from 'react';
import { LayoutDashboard, MessageSquare, Brush, Wrench, ShieldCheck, LogOut, Printer, PlusCircle } from 'lucide-react';

export const COLORS = {
  primary: '#064e3b', // Emerald 900
  secondary: '#059669', // Emerald 600
  accent: '#f59e0b', // Amber 500
};

export const CLEANING_STAFF = ['Yudo', 'Rafli', 'Sinta', 'Ravi'];
export const CHECKLIST_OFFICERS = ['Aprianson', 'Malik'];
export const SECURITY_STAFF = ['Mirza', 'Irfan', 'Eka', 'Inten'];
export const SECURITY_AREAS = ['Pos Depan', 'Tunggu Sidang', 'PTSP', 'Gedung'];

// Mapping of Staff to Rooms as requested
export const ROOM_ASSIGNMENTS: Record<string, { pic: string, lantai: 1 | 2 }> = {
  // Yudo (Lantai 1)
  'Ruang Sidang 1': { pic: 'Yudo', lantai: 1 },
  'Sidang 2': { pic: 'Yudo', lantai: 1 },
  'Sidang 3': { pic: 'Yudo', lantai: 1 },
  'Mediasi': { pic: 'Yudo', lantai: 1 },
  'Tunggu Sidang': { pic: 'Yudo', lantai: 1 },
  'Kolam': { pic: 'Yudo', lantai: 1 },
  'Bermain Anak': { pic: 'Yudo', lantai: 1 },
  'Laktasi': { pic: 'Yudo', lantai: 1 },
  'Toilet Wanita Tunggu Sidang': { pic: 'Yudo', lantai: 1 },
  'Toilet Pria Tunggu Sidang': { pic: 'Yudo', lantai: 1 },
  'Toilet Disabilitas Tunggu Sidang': { pic: 'Yudo', lantai: 1 },
  
  // Rafli (Lantai 1)
  'Ruang PTSP': { pic: 'Rafli', lantai: 1 },
  'Resepsionis': { pic: 'Rafli', lantai: 1 },
  'Tamu Terbuka': { pic: 'Rafli', lantai: 1 },
  'Kepaniteraan': { pic: 'Rafli', lantai: 1 },
  'Panitera': { pic: 'Rafli', lantai: 1 },
  'Arsip Perkara': { pic: 'Rafli', lantai: 1 },
  'Server': { pic: 'Rafli', lantai: 1 },
  'Toilet Pria & Wanita PSTP': { pic: 'Rafli', lantai: 1 },
  'Toilet Disabilitas PTSP': { pic: 'Rafli', lantai: 1 },
  'Toilet Resepsionis': { pic: 'Rafli', lantai: 1 },
  'Toilet Pria Pegawai Lt.1': { pic: 'Rafli', lantai: 1 },

  // Sinta (Lantai 2)
  'Ruang Ketua': { pic: 'Sinta', lantai: 2 },
  'Wakil Ketua': { pic: 'Sinta', lantai: 2 },
  'Sekretaris': { pic: 'Sinta', lantai: 2 },
  'Media Center': { pic: 'Sinta', lantai: 2 },
  'Perpustakaan': { pic: 'Sinta', lantai: 2 },
  'Ajudan': { pic: 'Sinta', lantai: 2 },
  'ZI': { pic: 'Sinta', lantai: 2 },
  'Corridor Kanan': { pic: 'Sinta', lantai: 2 },
  'Toilet Pegawai Wanita Lt.2': { pic: 'Sinta', lantai: 2 },

  // Ravi (Lantai 2)
  'Ruang Hakim 1': { pic: 'Ravi', lantai: 2 },
  'Hakim 2': { pic: 'Ravi', lantai: 2 },
  'Kesekretariatan': { pic: 'Ravi', lantai: 2 },
  'Jurusita': { pic: 'Ravi', lantai: 2 },
  'Panitera Pengganti': { pic: 'Ravi', lantai: 2 },
  'Corridor Kiri': { pic: 'Ravi', lantai: 2 },
  'Rooftop': { pic: 'Ravi', lantai: 2 },
  'Tangga Umum': { pic: 'Ravi', lantai: 2 },
};

export const ROOMS_F1 = Object.keys(ROOM_ASSIGNMENTS).filter(room => ROOM_ASSIGNMENTS[room].lantai === 1);
export const ROOMS_F2 = Object.keys(ROOM_ASSIGNMENTS).filter(room => ROOM_ASSIGNMENTS[room].lantai === 2);

export const MAINTENANCE_ITEMS = ['Gedung', 'Halaman', 'Kendaraan', 'PC', 'Laptop', 'Printer', 'AC'];

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['Admin', 'Viewer'] },
  { id: 'cleaning', label: 'Checklist Kebersihan', icon: <Brush className="w-5 h-5" />, roles: ['Admin', 'Checklist', 'ChecklistMaint'] },
  { id: 'maintenance', label: 'Realisasi Pemeliharaan', icon: <Wrench className="w-5 h-5" />, roles: ['Admin', 'Maintenance', 'ChecklistMaint'] },
  { id: 'security', label: 'Laporan Keamanan', icon: <ShieldCheck className="w-5 h-5" />, roles: ['Admin', 'Security'] },
  { id: 'complaints', label: 'Keluhan & Saran', icon: <MessageSquare className="w-5 h-5" />, roles: ['Admin'] },
];
