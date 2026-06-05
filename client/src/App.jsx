import React, { useEffect, useState, useRef } from 'react';
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
  const [activeFaction, setActiveFaction] = useState('dsa');
  const [terminalLogs, setTerminalLogs] = useState([
    "SYSTEM: Booting Redemption Arc OS...",
    "SYSTEM: Establishing secure quantum gateway...",
    "SYSTEM: Operative interface initialized.",
    "STATUS: Ready to calibrate."
  ]);

  // Dynamic log simulator
  useEffect(() => {
    const logPool = [
      "[STREAK] Operative secured 7-day focus loop.",
      "[AI_CORE] Prompt optimization complete. Engine temperature stable.",
      "[MISSION] Daily task 'Optimize database query' resolved.",
      "[XP] +250 XP awarded to active operative.",
      "[SECURITY] Encrypted session key rotated successfully.",
      "[MLOPS] Core model weights updated. Calibration: 99.8% precision.",
      "[DSA] Dynamic programming matrix resolved in 8.4ms.",
      "[MENTOR] Guidance protocol deployed. Focus efficiency +20%.",
      "[FOCUS] Deep work environment locked. Staggering notifications.",
      "[CALENDAR] Synchronized weekly event matrix successfully."
    ];

    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      const timestamp = new Date().toLocaleTimeString();
      setTerminalLogs(prev => [...prev.slice(-5), `[${timestamp}] ${randomLog}`]);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const factions = {
    dsa: {
      name: "Faction DSA",
      color: "from-orange-500 to-red-600",
      textColor: "text-orange-400",
      borderColor: "border-orange-500/30",
      glowColor: "shadow-orange-500/20",
      tagline: "Algorithms & Logic Optimizers",
      desc: "For operatives obsessed with structural elegance, optimized pathways, and resolving complex spatial complexities with absolute mathematical precision.",
      stats: { sync: 94, efficiency: 98, xp: "1.5x" },
      icon: <Cpu className="w-6 h-6 text-orange-400" />
    },
    mlops: {
      name: "Faction MLOps",
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-400",
      borderColor: "border-blue-500/30",
      glowColor: "shadow-blue-500/20",
      tagline: "Scale & Deploy Operators",
      desc: "For builders of intelligence pipelines, orchestrators of massive computation layers, and guardians of reliable continuous delivery metrics.",
      stats: { sync: 97, efficiency: 92, xp: "1.3x" },
      icon: <Activity className="w-6 h-6 text-blue-400" />
    },
    mentor: {
      name: "Faction Mentor",
      color: "from-purple-500 to-pink-600",
      textColor: "text-purple-400",
      borderColor: "border-purple-500/30",
      glowColor: "shadow-purple-500/20",
      tagline: "System Guidance & Architecture",
      desc: "For high-level strategists, master designers of scalable ecosystems, and keepers of standard design practices who guide younger node processes.",
      stats: { sync: 91, efficiency: 96, xp: "1.6x" },
      icon: <Crown className="w-6 h-6 text-purple-400" />
    },
    focus: {
      name: "Faction Focus",
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      glowColor: "shadow-emerald-500/20",
      tagline: "Deep Work Protocol Specialists",
      desc: "For dedicated operatives who value uninterrupted flow blocks, flow state preservation, and zero-distraction focus sprints above all else.",
      stats: { sync: 99, efficiency: 95, xp: "1.4x" },
      icon: <Target className="w-6 h-6 text-emerald-400" />
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#030305] font-inter text-textMain scroll-smooth selection:bg-primary/30">
      
      {/* Immersive Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/5 blur-[150px] animate-pulse-slow"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/5 blur-[150px] animate-float"></div>
      <div className="absolute inset-0 opacity-15 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] animate-scanline mix-blend-overlay pointer-events-none"></div>

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center backdrop-blur-md border-b border-white/5 bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black/60 border border-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <span className="font-outfit font-black text-2xl tracking-[0.2em] text-white">REARC</span>
        </div>
        <div className="flex gap-6 items-center">
          <Link to="/login" className="text-sm font-bold tracking-widest text-textMuted hover:text-white transition-colors uppercase">Login</Link>
          <Link to="/signup" className="text-xs tracking-[0.2em] bg-primary text-black hover:opacity-90 px-6 py-3 rounded-lg transition-all font-black uppercase shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 active:scale-95">Initialize</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <div className="z-10 text-center max-w-5xl relative flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6 }} 
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-primary/30 bg-black/60 mb-8 backdrop-blur-md shadow-[0_0_25px_rgba(168,85,247,0.15)]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(168,85,247,1)]"></span>
            <span className="text-xs font-black tracking-[0.35em] text-primary uppercase">Elite Discipline OS Active</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.1 }} 
            className="text-5xl md:text-[6.5rem] font-black mb-8 tracking-tighter leading-[1] text-white"
          >
            BUILD YOUR <br/>
            <span className="neon-flicker text-transparent bg-clip-text bg-gradient-to-br from-white via-primary to-secondary">
              REDEMPTION ARC
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }} 
            className="text-lg md:text-xl text-textMuted mb-12 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            An emotionally immersive productivity universe designed for serious operatives to forge discipline, maintain consistency, and execute critical daily missions.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.3 }} 
            className="flex flex-col sm:flex-row items-center justify-center gap-8 relative z-20"
          >
            <Link to="/signup" className="group relative rounded-2xl bg-white text-black px-12 py-5 font-black transition-transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-3 overflow-hidden shadow-[0_0_35px_rgba(255,255,255,0.2)]">
              <div className="absolute inset-0 bg-primary/20 group-hover:translate-x-full -translate-x-full transition-transform duration-500 skew-x-12"></div>
              <span className="relative z-10 flex items-center gap-2 tracking-[0.1em] uppercase">Enter The Universe <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" /></span>
            </Link>
          </motion.div>
        </div>

        {/* Cinematic Wireframe Perspective Grid */}
        <div className="absolute bottom-0 left-0 right-0 h-[35vh] perspective-grid-container pointer-events-none overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#030305] to-[#030305] z-10"></div>
          <div className="w-full h-[200%] perspective-grid opacity-60"></div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-textMuted/60 animate-bounce pointer-events-none">
          <span className="text-[10px] tracking-[0.4em] uppercase font-black">Scroll to Calibrate</span>
          <ChevronRight className="w-4 h-4 rotate-90" />
        </div>
      </section>

      {/* Protocol Phases Section */}
      <section className="py-24 px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-black tracking-[0.4em] text-primary uppercase block mb-3">System Blueprint</span>
          <h2 className="text-4xl md:text-5xl font-black text-white">THE ARCHITECTURE PHASES</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Console Calibration",
              desc: "Deploy customized setup parameters and choose your operational theme matrix.",
              icon: <Cpu className="w-8 h-8 text-primary" />
            },
            {
              step: "02",
              title: "Align Factions",
              desc: "Choose specialized task methodologies and dynamic guidance profiles.",
              icon: <Zap className="w-8 h-8 text-secondary" />
            },
            {
              step: "03",
              title: "Execute Missions",
              desc: "Tackle target constraints daily with real-time feedback loops.",
              icon: <Target className="w-8 h-8 text-blue-400" />
            },
            {
              step: "04",
              title: "Quantum Growth",
              desc: "Generate streak nodes, gather core system XP, and monitor evolution metrics.",
              icon: <Crown className="w-8 h-8 text-purple-400" />
            }
          ].map((phase, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#0A0A0F]/80 backdrop-blur-md border border-white/5 p-8 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 text-[10rem] leading-none font-black text-white/[0.02] select-none translate-x-4 -translate-y-4 group-hover:text-primary/[0.04] transition-all">
                {phase.step}
              </div>
              <div className="mb-6 p-3 bg-white/5 rounded-xl w-fit group-hover:scale-110 transition-transform">
                {phase.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{phase.title}</h3>
              <p className="text-textMuted text-sm leading-relaxed">{phase.desc}</p>
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-500"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Faction Simulator Section */}
      <section className="py-24 px-8 max-w-6xl mx-auto w-full relative z-10">
        <div className="bg-[#0A0A10]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Selector list */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-black tracking-[0.4em] text-secondary uppercase block mb-2">Calibration Hub</span>
                <h2 className="text-3xl md:text-4xl font-black text-white">SELECT YOUR DISCIPLINE</h2>
              </div>
              
              <div className="flex flex-col gap-3">
                {Object.entries(factions).map(([key, f]) => {
                  const isActive = activeFaction === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveFaction(key)}
                      className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                        isActive 
                        ? `bg-white/5 border-primary/40 shadow-lg shadow-primary/5` 
                        : 'border-white/5 bg-transparent hover:bg-white/[0.02] hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {f.icon}
                        <div>
                          <div className={`font-bold text-sm ${isActive ? 'text-white' : 'text-textMuted'}`}>{f.name}</div>
                          <div className="text-[10px] text-textMuted/60 font-medium">{f.tagline}</div>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-textMuted/40 transition-transform ${isActive ? 'translate-x-1 text-white' : ''}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Display Panel */}
            <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 relative min-h-[350px] flex flex-col justify-between">
              
              {/* Particle Core graphic at top right */}
              <div className="absolute top-6 right-6 w-16 h-16 rounded-full flex items-center justify-center border border-white/5">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${factions[activeFaction].color} animate-pulse blur-[8px]`}></div>
                <div className={`absolute w-3 h-3 rounded-full bg-white animate-ping`}></div>
              </div>

              <div>
                <div className={`inline-block px-3 py-1 rounded border text-[10px] font-black tracking-widest uppercase mb-4 ${factions[activeFaction].borderColor} ${factions[activeFaction].textColor}`}>
                  Active Protocol Matrix
                </div>
                
                <h3 className="text-2xl font-black text-white mb-2">{factions[activeFaction].name}</h3>
                <p className="text-textMuted text-sm leading-relaxed mb-6">
                  {factions[activeFaction].desc}
                </p>
              </div>

              {/* Stats readout */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-[10px] text-textMuted/60 uppercase font-black">Sync Rate</div>
                    <div className="text-xl font-bold text-white mt-1">{factions[activeFaction].stats.sync}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-textMuted/60 uppercase font-black">Core Load</div>
                    <div className="text-xl font-bold text-white mt-1">{factions[activeFaction].stats.efficiency}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-textMuted/60 uppercase font-black">XP Modifier</div>
                    <div className="text-xl font-bold text-primary mt-1">{factions[activeFaction].stats.xp}</div>
                  </div>
                </div>

                {/* Animated loading bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-textMuted font-bold">
                    <span>SECTOR CALIBRATION STATUS</span>
                    <span>99.2% READY</span>
                  </div>
                  <div className="bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className={`bg-gradient-to-r ${factions[activeFaction].color} h-full w-[99.2%] shadow-[0_0_8px_rgba(168,85,247,0.4)]`}></div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Terminal logs mockup */}
      <section className="py-16 px-8 max-w-4xl mx-auto w-full relative z-10">
        <div className="bg-[#050508]/90 border border-white/5 rounded-2xl overflow-hidden font-mono shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          {/* Window header */}
          <div className="bg-[#0A0A0F] px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/50"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/30 border border-yellow-500/50"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50"></span>
            </div>
            <span className="text-[11px] text-textMuted font-semibold">rearc_operative_shell.sh</span>
            <span className="w-4 h-4 text-textMuted/20 text-xs">■</span>
          </div>
          
          {/* Terminal content */}
          <div className="p-6 text-sm text-emerald-400 space-y-2 h-[220px] overflow-y-auto custom-scrollbar select-none">
            {terminalLogs.map((log, index) => (
              <div key={index} className="flex gap-3 leading-relaxed transition-opacity duration-300">
                <span className="text-emerald-500/50">{">"}</span>
                <span>{log}</span>
              </div>
            ))}
            <div className="flex items-center gap-1">
              <span className="text-emerald-500/50">{">"}</span>
              <span className="w-2 h-4 bg-emerald-400 animate-pulse"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Gateway */}
      <section className="py-24 px-8 text-center relative z-10 max-w-4xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white">READY TO EMBARK?</h2>
          <p className="text-textMuted max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Your calibration metrics are aligned. The console is initialized. Launch your redemption sequence right now.
          </p>
          
          <div>
            <Link 
              to="/signup" 
              className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-black uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95 transition-transform"
            >
              Initialize Node <Cpu className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-white/5 text-center text-xs text-textMuted/40 relative z-10">
        <div>&copy; {new Date().getFullYear()} REARC OPERATIVE NETWORK. ALL RIGHTS RESERVED.</div>
      </footer>

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
