import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, TrendingUp, ChevronRight, Activity, Cpu, LogOut, LayoutDashboard, Calendar as CalendarIcon, CheckSquare, Target, Settings, Crown } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import SetupWizard from './pages/SetupWizard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Calendar from './pages/Calendar';
import DailyMission from './pages/DailyMission';
import AIChat from './components/AIChat';
import { useAuthStore } from './store/authStore';
import { useArcStore } from './store/arcStore';
import { useThemeStore } from './store/themeStore';
import { Moon, Sun } from 'lucide-react';


// Cinematic Energy Background
const AmbientBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 bg-background overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
    <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[100px] animate-pulse-slow"></div>
    <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scanline shadow-[0_0_15px_rgba(var(--color-primary),0.5)]"></div>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Sidebar Layout Component
const AppShell = ({ children }) => {
  const { logout, user } = useAuthStore();
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Schedule', path: '/calendar', icon: <CalendarIcon className="w-4 h-4" /> },
    { name: 'Missions', path: '/mission/today', icon: <CheckSquare className="w-4 h-4" /> },
    { name: 'AI Configuration', path: '/setup', icon: <Target className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-textMain flex font-inter overflow-hidden relative z-10">
      <AmbientBackground />
      {/* Sidebar */}
      <aside className="w-[260px] flex-shrink-0 bg-[#06060A]/80 backdrop-blur-2xl flex flex-col hidden md:flex z-20 relative border-r border-white/5">
        
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center p-px shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <div className="w-full h-full bg-[#06060A] rounded-full flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-primary/20"></div>
               <span className="font-outfit font-bold text-xs text-white relative z-10">A</span>
            </div>
          </div>
          <div className="leading-tight">
            <div className="font-outfit font-black text-[15px] tracking-[0.1em] text-white uppercase">REDEMPTION</div>
            <div className="font-outfit font-bold text-[10px] tracking-[0.4em] text-textMuted uppercase flex items-center gap-1">A <Activity className="w-2 h-2 text-primary" /> R C</div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path.split('/')[1] ? `/${item.path.split('/')[1]}` : item.path);
            return (
              <Link key={item.path} to={item.path} className="relative block group">
                {isActive && (
                  <motion.div layoutId="nav-bg" className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent border border-primary/20 rounded-xl" transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
                )}
                <div className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive ? 'text-white font-medium' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}>
                  <div className={`${isActive ? 'text-[#C084FC]' : 'text-[#64748B] group-hover:text-white transition-colors'}`}>
                    {item.icon}
                  </div>
                  <span className="text-[14px]">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        
        {/* Profile Card at bottom */}
        <div className="p-4 mt-auto space-y-2">
          <div className="bg-[#0A0A0F] border border-white/5 rounded-2xl p-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-3 relative z-10 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white text-sm shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="text-[13px] font-bold text-white">{user?.name || 'Operative'}</div>
                <div className="text-[10px] text-primary mt-0.5 uppercase tracking-widest font-bold">Rank {user?.level || 1}</div>
              </div>
            </div>
            <div className="relative z-10">
              <div className="flex justify-between text-[10px] text-[#475569] mb-1 font-medium">
                <span>{(user?.xp || 0) % 1000} XP</span>
                <span>1000 XP</span>
              </div>
              <div className="bg-[#151520] rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-primary to-secondary h-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                  animate={{ width: `${(((user?.xp || 0) % 1000) / 1000) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[#475569] hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-[13px] font-bold">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative custom-scrollbar z-10 bg-[#030305]">
        {children}
      </main>
      <AIChat />
    </div>
  );
};

// Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0A0A0C] font-inter text-textMain">
      
      {/* Immersive Atmospheric Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/15 via-background to-background pointer-events-none"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[150px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/10 blur-[150px] animate-float"></div>
      
      {/* Floating Particles (CSS approximated) */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] animate-scanline mix-blend-overlay"></div>

      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center backdrop-blur-md border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black/50 border border-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(var(--color-primary),0.2)]">
            <Activity className="w-5 h-5 text-primary text-glow-emerald" />
          </div>
          <span className="font-outfit font-black text-2xl tracking-[0.2em] text-white">REARC</span>
        </div>
        <div className="flex gap-6 items-center">
          <Link to="/login" className="text-sm font-bold tracking-widest text-textMuted hover:text-white transition-colors uppercase">Login</Link>
          <Link to="/signup" className="text-xs tracking-[0.2em] bg-primary text-black hover:opacity-90 px-6 py-3 rounded-lg transition-opacity font-black uppercase shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:scale-105 active:scale-95">Initialize</Link>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center pt-20 relative z-10">
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="z-10 text-center max-w-5xl px-4 relative flex flex-col items-center">
          
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-primary/30 bg-black/40 mb-10 backdrop-blur-md shadow-[0_0_30px_rgba(var(--color-primary),0.15)]">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-fast shadow-[0_0_10px_rgba(var(--color-primary),1)]"></span>
            <span className="text-xs font-black tracking-[0.3em] text-primary uppercase">Elite Discipline OS Active</span>
          </div>
          
          <h1 className="text-6xl md:text-[7rem] font-black mb-8 tracking-tighter leading-[1] text-white drop-shadow-2xl">
            BUILD YOUR <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-primary to-accent drop-shadow-[0_0_35px_rgba(var(--color-primary),0.5)]">
              REDEMPTION ARC
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-textMuted mb-16 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
            An emotionally immersive productivity universe designed for serious operatives to forge discipline, maintain consistency, and execute missions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 relative z-20">
            <Link to="/signup" className="group relative rounded-2xl bg-white text-black px-12 py-5 font-black transition-transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-3 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              <div className="absolute inset-0 bg-primary/20 group-hover:translate-x-full -translate-x-full transition-transform duration-500 skew-x-12"></div>
              <span className="relative z-10 flex items-center gap-3 tracking-[0.1em] uppercase">Enter The Universe <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" /></span>
            </Link>
          </div>
          
        </motion.div>
        
        {/* Animated Cinematic Orb Background */}
        <div className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none opacity-60 flex items-center justify-center">
           <div className="absolute inset-0 rounded-full border-[1px] border-primary/20 animate-spin-slow"></div>
           <div className="absolute inset-10 rounded-full border-[1px] border-primary/10 animate-spin-slow" style={{animationDirection: 'reverse', animationDuration: '20s'}}></div>
           <div className="absolute inset-20 rounded-full border-[1px] border-dashed border-primary/20 animate-spin-slow" style={{animationDuration: '25s'}}></div>
           <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-t from-primary/30 to-transparent blur-[80px]"></div>
        </div>

      </div>
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { arc } = useArcStore();

  const todayMissionDay = arc
    ? Math.max(1, Math.floor((new Date() - new Date(arc.startDate)) / (1000 * 60 * 60 * 24)) + 1)
    : 1;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
          </motion.div>
        } />
        <Route path="/login" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
          </motion.div>
        } />
        <Route path="/signup" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />}
          </motion.div>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppShell>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <Dashboard />
              </motion.div>
            </AppShell>
          </ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute>
            <AppShell>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <Calendar />
              </motion.div>
            </AppShell>
          </ProtectedRoute>
        } />
        {/* mission/today redirects to the current day number */}
        <Route path="/mission/today" element={
          <ProtectedRoute>
            <Navigate to={`/mission/${todayMissionDay}`} replace />
          </ProtectedRoute>
        } />
        <Route path="/mission/:dayId" element={
          <ProtectedRoute>
            <AppShell>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <DailyMission />
              </motion.div>
            </AppShell>
          </ProtectedRoute>
        } />
        <Route path="/setup" element={
          <ProtectedRoute>
            <AppShell>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <SetupWizard />
              </motion.div>
            </AppShell>
          </ProtectedRoute>
        } />
        {/* Catch-all: redirect authenticated users to dashboard */}
        <Route path="*" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [theme]);

  return (
    <Router>
      <div className="bg-background min-h-screen text-textMain selection:bg-primary/30 transition-colors duration-500">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}
