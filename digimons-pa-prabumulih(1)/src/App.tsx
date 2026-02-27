
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

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pa_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [keluhans, setKeluhans] = useState<Keluhan[]>(() => {
    const saved = localStorage.getItem('pa_keluhans');
    return saved ? JSON.parse(saved) : [];
  });

  const [cleaningLogs, setCleaningLogs] = useState<CleaningLog[]>(() => {
    const saved = localStorage.getItem('pa_cleaning');
    return saved ? JSON.parse(saved) : [];
  });

  const [maintLogs, setMaintLogs] = useState<MaintenanceLog[]>(() => {
    const saved = localStorage.getItem('pa_maint');
    return saved ? JSON.parse(saved) : [];
  });

  const [secLogs, setSecLogs] = useState<SecurityLog[]>(() => {
    const saved = localStorage.getItem('pa_security');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pa_keluhans', JSON.stringify(keluhans));
  }, [keluhans]);

  useEffect(() => {
    localStorage.setItem('pa_cleaning', JSON.stringify(cleaningLogs));
  }, [cleaningLogs]);

  useEffect(() => {
    localStorage.setItem('pa_maint', JSON.stringify(maintLogs));
  }, [maintLogs]);

  useEffect(() => {
    localStorage.setItem('pa_security', JSON.stringify(secLogs));
  }, [secLogs]);

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
    if (!user) {
      return <Login onLogin={handleLogin} />;
    }
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
                  user.role === 'Admin' || user.role === 'Viewer' ? (
                    <Dashboard keluhans={keluhans} cleaning={cleaningLogs} maintenance={maintLogs} security={secLogs} />
                  ) : user.role === 'ChecklistMaint' ? (
                    <CleaningChecklist 
                      user={user} 
                      logs={cleaningLogs} 
                      onAdd={(l) => setCleaningLogs(prev => [l, ...prev])} 
                      onDelete={(id) => setCleaningLogs(prev => prev.filter(l => String(l.id) !== String(id)))} 
                    />
                  ) : user.role === 'Security' ? (
                    <SecurityPage 
                      user={user} 
                      logs={secLogs} 
                      onAdd={(l) => setSecLogs(prev => [l, ...prev])} 
                      onDelete={(id) => setSecLogs(prev => prev.filter(l => String(l.id) !== String(id)))} 
                    />
                  ) : (
                    <Dashboard keluhans={keluhans} cleaning={cleaningLogs} maintenance={maintLogs} security={secLogs} />
                  )
                ) : (
                  <PublicKeluhan existingKeluhans={keluhans} onAdd={(k) => setKeluhans(prev => [k, ...prev])} />
                )
              } />

              <Route path="/public" element={<PublicKeluhan existingKeluhans={keluhans} onAdd={(k) => setKeluhans(prev => [k, ...prev])} />} />
              <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />
              <Route path="/cleaning" element={renderProtectedRoute(CleaningChecklist, { logs: cleaningLogs, onAdd: (l: CleaningLog) => setCleaningLogs(prev => [l, ...prev]), onDelete: (id: string) => setCleaningLogs(prev => prev.filter(l => String(l.id) !== String(id))) })} />
              <Route path="/maintenance" element={renderProtectedRoute(MaintenancePage, { logs: maintLogs, onAdd: (l: MaintenanceLog) => setMaintLogs(prev => [l, ...prev]), onDelete: (id: string) => setMaintLogs(prev => prev.filter(l => String(l.id) !== String(id))) })} />
              <Route path="/security" element={renderProtectedRoute(SecurityPage, { logs: secLogs, onAdd: (l: SecurityLog) => setSecLogs(prev => [l, ...prev]), onDelete: (id: string) => setSecLogs(prev => prev.filter(l => String(l.id) !== String(id))) })} />
              <Route path="/complaints" element={
                user?.role === 'Admin' ? (
                  <ComplaintsAdmin 
                    keluhans={keluhans} 
                    onUpdate={(k) => setKeluhans(prev => prev.map(item => item.id === k.id ? k : item))} 
                    onDelete={(id) => setKeluhans(prev => prev.filter(k => String(k.id) !== String(id)))} 
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
