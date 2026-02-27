import React, { useState, useEffect, useMemo } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, Keluhan, CleaningLog, MaintenanceLog, SecurityLog } from './types';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PublicKeluhan from './pages/PublicKeluhan';
import CleaningChecklist from './pages/CleaningChecklist';
import MaintenancePage from './pages/MaintenancePage';
import SecurityPage from './pages/SecurityPage';
import ComplaintsAdmin from './pages/ComplaintsAdmin';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// IMPORT FIREBASE UTILS
import { db } from './firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pa_user');
    return saved ? JSON.parse(saved) : null;
  });

  // State untuk data dari Firebase
  const [keluhans, setKeluhans] = useState<Keluhan[]>([]);
  const [cleaningLogs, setCleaningLogs] = useState<CleaningLog[]>([]);
  const [maintLogs, setMaintLogs] = useState<MaintenanceLog[]>([]);
  const [secLogs, setSecLogs] = useState<SecurityLog[]>([]);

  // 1. SINCRONIZE DATA KELUHAN DARI FIREBASE
  useEffect(() => {
    const q = query(collection(db, "complaints"), orderBy("id", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Keluhan));
      setKeluhans(data);
    });
    return () => unsubscribe();
  }, []);

  // 2. SINCRONIZE DATA CLEANING DARI FIREBASE
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "cleaning"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as CleaningLog));
      setCleaningLogs(data);
    });
    return () => unsubscribe();
  }, []);

  // FUNGSI HANDLER UNTUK FIREBASE
  const handleAddKeluhan = async (k: any) => {
    await addDoc(collection(db, "complaints"), k);
  };

  const handleUpdateKeluhan = async (k: Keluhan) => {
    const docRef = doc(db, "complaints", k.id);
    await updateDoc(docRef, { ...k });
  };

  const handleDeleteKeluhan = async (id: string) => {
    await deleteDoc(doc(db, "complaints", id));
  };

  const handleAddCleaning = async (l: any) => {
    await addDoc(collection(db, "cleaning"), l);
  };

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('pa_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pa_user');
  };

  const pendingComplaints = useMemo(() => {
    return keluhans.filter(k => k.status === 'Menunggu' && !k.isValidated);
  }, [keluhans]);

  const renderProtectedRoute = (Component: React.ElementType, props: any = {}) => {
    if (!user) return <Login onLogin={handleLogin} />;
    return <Component user={user} {...props} />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
        {user && <Sidebar user={user} onLogout={handleLogout} />}
        
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {user && <Header user={user} pendingComplaints={pendingComplaints} />}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={
                user ? (
                  <Dashboard keluhans={keluhans} cleaning={cleaningLogs} maintenance={maintLogs} security={secLogs} />
                ) : (
                  <PublicKeluhan existingKeluhans={keluhans} onAdd={handleAddKeluhan} />
                )
              } />

              <Route path="/public" element={<PublicKeluhan existingKeluhans={keluhans} onAdd={handleAddKeluhan} />} />
              <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />
              
              <Route path="/cleaning" element={renderProtectedRoute(CleaningChecklist, { 
                logs: cleaningLogs, 
                onAdd: handleAddCleaning,
                onDelete: async (id: string) => await deleteDoc(doc(db, "cleaning", id))
              })} />

              <Route path="/complaints" element={
                user?.role === 'Admin' ? (
                  <ComplaintsAdmin 
                    keluhans={keluhans} 
                    onUpdate={handleUpdateKeluhan} 
                    onDelete={handleDeleteKeluhan} 
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
