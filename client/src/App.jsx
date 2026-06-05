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

// Floating Spores (Upside Down Ash) component
const FloatingSpores = () => {
  const sporeCount = 45;
  const spores = Array.from({ length: sporeCount }).map((_, i) => {
    const size = Math.random() * 4 + 2; // 2px to 6px
    const left = Math.random() * 100; // 0% to 100%
    const delay = Math.random() * 8; // 0s to 8s
    const duration = Math.random() * 6 + 6; // 6s to 12s
    return (
      <div
        key={i}
        className="spore"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          animationName: 'float-spore',
          animationIterationCount: 'infinite',
          animationTimingFunction: 'linear',
          bottom: '-20px',
        }}
      />
    );
  });
  return <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">{spores}</div>;
};

// Retro CRT Lab Terminal Component for interactive showcase
const RetroTerminal = () => {
  const [activeTab, setActiveTab] = React.useState('system');
  const [typedText, setTypedText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);

  const logs = {
    system: `[HAWKINS LAB ARCHIVE // PROJECT REARC]
STATUS: OPERATIONAL
CLASSIFIED LEVEL: DEEP VOID
------------------------------------------
>> DECRYPTING INTEL CHANNELS...
>> PORTAL STATUS: STABLE (STRENGTH 89%)
>> NEURAL INTEGRATION: CONNECTED
>> SUBJECT ALIGNMENT: FORGING REDEMPTION
>> WARNING: HIGH LEVELS OF PSYCHIC ENERGY DETECTED
------------------------------------------
DAILY MISSION SUCCESS RATE REQUIRED: > 80%`,
    mission: `>> RETRIEVING CURRENT DIRECTIVES...
------------------------------------------
MISSION ID: ARC-912
OBJECTIVE: ESCAPE THE MIND FLAYER
REWARD: +500 XP // LEVEL UP RANK
THREAT LEVEL: COGNITIVE OVERLOAD
------------------------------------------
STATUS LOGS:
- DEFEND FOCUS BLOCK: PENDING
- SYNAPSE SYNC: COMPLETE
- INGEST KNOWLEDGE CORRECTIONS: ACTIVE`,
    psychic: `>> MEASURING PSYCHIC FOCUS STREAKS...
------------------------------------------
STREAK MATRIX:
MON [X]   TUE [X]   WED [X]   THU [ ]
FRI [ ]   SAT [ ]   SUN [ ]
------------------------------------------
>> NOTICE: COMPILING A 3-DAY CHAIN FORGE.
>> DO NOT BREAK THE STREAK, OR THE VOID
   WILL ENVELOPE YOUR PROGRESS.`,
  };

  React.useEffect(() => {
    setIsTyping(true);
    setTypedText('');
    let index = 0;
    const fullText = logs[activeTab];
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="w-full max-w-3xl bg-[#07070B] border-2 border-red-950 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(229,9,20,0.15)] relative">
      {/* CRT Scanline and Bezel Overlay */}
      <div className="absolute inset-0 crt-scanlines pointer-events-none z-20"></div>
      
      {/* Terminal Title Bar */}
      <div className="bg-[#120606] px-6 py-4 border-b border-red-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_#e50914]"></div>
          <span className="font-vt323 text-red-500 text-lg tracking-wider">HAWKINS_TERMINAL_V1.09</span>
        </div>
        <div className="text-[10px] text-red-700/60 font-mono tracking-widest uppercase">
          SECURE CONNECTION // ARC
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 relative z-10">
        {/* Terminal Controls */}
        <div className="flex md:flex-col gap-2 md:w-1/4">
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-3 rounded-lg font-vt323 text-left tracking-wider text-base uppercase transition-all duration-300 ${activeTab === 'system' ? 'bg-red-950/50 text-red-400 border border-red-800/60 shadow-[0_0_15px_rgba(229,9,20,0.2)]' : 'text-red-700 hover:text-red-500 bg-transparent border border-transparent'}`}
          >
            [SYSTEM LOGS]
          </button>
          <button
            onClick={() => setActiveTab('mission')}
            className={`px-4 py-3 rounded-lg font-vt323 text-left tracking-wider text-base uppercase transition-all duration-300 ${activeTab === 'mission' ? 'bg-red-950/50 text-red-400 border border-red-800/60 shadow-[0_0_15px_rgba(229,9,20,0.2)]' : 'text-red-700 hover:text-red-500 bg-transparent border border-transparent'}`}
          >
            [MISSIONS]
          </button>
          <button
            onClick={() => setActiveTab('psychic')}
            className={`px-4 py-3 rounded-lg font-vt323 text-left tracking-wider text-base uppercase transition-all duration-300 ${activeTab === 'psychic' ? 'bg-red-950/50 text-red-400 border border-red-800/60 shadow-[0_0_15px_rgba(229,9,20,0.2)]' : 'text-red-700 hover:text-red-500 bg-transparent border border-transparent'}`}
          >
            [STREAK LINK]
          </button>
        </div>

        {/* Console Output Screen */}
        <div className="flex-1 bg-[#020204] border border-red-950/50 rounded-xl p-5 min-h-[220px] font-vt323 text-red-500 text-lg md:text-xl leading-relaxed whitespace-pre-wrap relative overflow-hidden select-none">
          <div className="absolute top-2 right-3 text-[10px] text-red-700 font-mono">
            {isTyping ? 'RUNNING...' : 'READY'}
          </div>
          {typedText}
          <span className="inline-block w-2.5 h-5 ml-1 bg-red-500 animate-pulse"></span>
        </div>
      </div>
    </div>
  );
};

// Landing Page Component
const LandingPage = () => {
  const scrollToDeep = () => {
    document.getElementById('deep-rift-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#040203] font-inter text-textMain overflow-y-auto">
      {/* Immersive Spores */}
      <FloatingSpores />
      
      {/* Immersive Atmospheric Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/20 via-black to-[#050304] pointer-events-none"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-red-900/10 blur-[150px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-red-950/15 blur-[150px] animate-float"></div>
      
      {/* Scanline background overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] animate-scanline mix-blend-overlay"></div>

      {/* Navigation bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex justify-between items-center backdrop-blur-md border-b border-red-950/40 bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black/50 border border-red-900/40 flex items-center justify-center shadow-[0_0_15px_rgba(229,9,20,0.15)]">
            <span className="font-vt323 font-black text-2xl text-red-600 text-glow-red animate-pulse">Ω</span>
          </div>
          <span className="font-garamond font-black text-2xl tracking-[0.25em] text-red-600 text-glow-red uppercase select-none">REARC</span>
        </div>
        <div className="flex gap-6 items-center">
          <Link to="/login" className="text-sm font-bold tracking-widest text-red-500/80 hover:text-red-400 transition-colors uppercase font-vt323">[ Login ]</Link>
          <Link to="/signup" className="text-xs tracking-[0.2em] bg-red-700 text-white hover:bg-red-600 px-6 py-3 rounded-lg font-black uppercase shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 font-vt323 border border-red-500/30">INITIALIZE ARC</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="min-h-screen flex flex-col items-center justify-center pt-28 px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, ease: "easeOut" }} 
          className="z-10 text-center max-w-5xl px-4 relative flex flex-col items-center"
        >
          {/* Faction Header Banner */}
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-red-900/50 bg-black/60 mb-10 backdrop-blur-md shadow-[0_0_30px_rgba(229,9,20,0.15)]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_#e50914]"></span>
            <span className="text-[11px] font-vt323 tracking-[0.35em] text-red-500 uppercase">SYSTEM DIAGNOSTICS: STABLE // REDEMPTION PROTOCOL</span>
          </div>
          
          {/* Stranger Things Inspired Glowing Red Logo Title */}
          <div className="flex flex-col items-center select-none font-garamond mb-12 relative">
            {/* Top neon bar */}
            <div className="w-48 md:w-80 h-[2.5px] bg-red-600 shadow-[0_0_20px_#e50914] mb-4 animate-pulse"></div>
            
            <h1 className="stranger-title text-7xl md:text-[9.5rem] font-black leading-none uppercase tracking-widest text-center select-none">
              REARC
            </h1>
            
            {/* Bottom neon bar */}
            <div className="w-64 md:w-[28rem] h-[2.5px] bg-red-600 shadow-[0_0_20px_#e50914] mt-4 animate-pulse"></div>
            
            <span className="font-vt323 text-red-500/80 tracking-[0.45em] uppercase text-xs md:text-sm mt-5 text-glow-red flicker-slow">
              // WARNING: PREPARE FOR DEEP COGNITIVE RECONSTRUCT //
            </span>
          </div>
          
          <p className="text-lg md:text-xl font-garamond italic text-red-200/70 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            "We are not defined by the void. We build bridges across the rift, forging discipline and order where chaos and distraction seek to consume our potential."
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 relative z-20 mb-12">
            <Link to="/signup" className="group relative rounded-xl bg-red-700 border border-red-500/40 text-white px-10 py-5 font-vt323 text-xl tracking-[0.15em] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden shadow-[0_0_40px_rgba(229,9,20,0.3)]">
              <div className="absolute inset-0 bg-red-600 group-hover:translate-x-full -translate-x-full transition-transform duration-500 skew-x-12"></div>
              <span className="relative z-10 flex items-center gap-3 uppercase font-black">
                ENTER THE GATEWAY <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Smooth Scroll Indicator */}
          <button 
            onClick={scrollToDeep}
            className="animate-bounce flex flex-col items-center gap-2 mt-4 text-red-700/60 hover:text-red-500 transition-colors font-vt323 cursor-pointer z-20"
          >
            <span className="text-xs uppercase tracking-widest">SCROLL DOWN INTO THE RIFT</span>
            <div className="w-5 h-8 rounded-full border border-red-800/40 flex items-start justify-center p-1">
              <div className="w-1 h-2 bg-red-600 rounded-full animate-scroll-down"></div>
            </div>
          </button>
          
        </motion.div>
        
        {/* Animated Cinematic Rift Glow Background */}
        <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] pointer-events-none opacity-40 flex items-center justify-center">
           <div className="absolute inset-0 rounded-full border border-red-800/10 animate-spin-slow"></div>
           <div className="absolute inset-10 rounded-full border border-red-900/10 animate-spin-slow" style={{animationDirection: 'reverse', animationDuration: '22s'}}></div>
           <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-t from-red-600/20 to-transparent blur-[70px]"></div>
        </div>
      </div>

      {/* SECTION 2: THE UPSIDE DOWN RIFT DETAILS */}
      <section id="deep-rift-section" className="py-32 px-6 md:px-12 relative z-20 border-t border-red-950/40 bg-[#050304]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-20 flex flex-col items-center">
            <span className="font-vt323 text-red-600 tracking-[0.3em] uppercase text-sm mb-3 text-glow-red">// RIFT CHRONICLES //</span>
            <h2 className="text-4xl md:text-5xl font-garamond font-black text-white uppercase tracking-wider mb-6">
              THE UPSIDE DOWN OF <span className="text-red-600 text-glow-red">PRODUCTIVITY</span>
            </h2>
            <div className="w-24 h-[1px] bg-red-800"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* Feature card 1 */}
            <div className="group bg-black/40 border border-red-950/60 p-8 rounded-2xl relative overflow-hidden red-portal-glow transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-950/10 to-transparent pointer-events-none"></div>
              <div className="w-12 h-12 rounded-xl bg-red-950/30 border border-red-900/30 flex items-center justify-center mb-6 text-red-500 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-vt323 tracking-wider text-red-400 uppercase mb-3 font-bold">
                1. MISSION DIRECTIVES
              </h3>
              <p className="font-garamond text-red-100/60 leading-relaxed">
                Receive and execute critical daily protocols designed to build ultimate willpower. Keep the shadows back by keeping consistency active.
              </p>
            </div>

            {/* Feature card 2 */}
            <div className="group bg-black/40 border border-red-950/60 p-8 rounded-2xl relative overflow-hidden red-portal-glow transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-950/10 to-transparent pointer-events-none"></div>
              <div className="w-12 h-12 rounded-xl bg-red-950/30 border border-red-900/30 flex items-center justify-center mb-6 text-red-500 group-hover:scale-110 transition-transform">
                <CalendarIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-vt323 tracking-wider text-red-400 uppercase mb-3 font-bold">
                2. STREAK SHIELDING
              </h3>
              <p className="font-garamond text-red-100/60 leading-relaxed">
                Your progress is tracked in a grid-like void matrix. Lock in chains of consistency to expand the portal bounds and strengthen your mental shields.
              </p>
            </div>

            {/* Feature card 3 */}
            <div className="group bg-black/40 border border-red-950/60 p-8 rounded-2xl relative overflow-hidden red-portal-glow transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-950/10 to-transparent pointer-events-none"></div>
              <div className="w-12 h-12 rounded-xl bg-red-950/30 border border-red-900/30 flex items-center justify-center mb-6 text-red-500 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-vt323 tracking-wider text-red-400 uppercase mb-3 font-bold">
                3. NEURAL COMPANION
              </h3>
              <p className="font-garamond text-red-100/60 leading-relaxed">
                Connect your psychic link to the AI Configuration Engine. Build a companion trained to assist, critique, and oversee your path to dominance.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: HAWKINS LAB RETRO INTERACTIVE TERMINAL */}
      <section className="py-24 px-6 md:px-12 relative z-20 border-t border-red-950/40 bg-black">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="font-vt323 text-red-600 tracking-[0.3em] uppercase text-sm mb-3 text-glow-red">// CLASSIFIED INTEL LINK //</span>
            <h2 className="text-4xl font-garamond font-black text-white uppercase tracking-wider mb-6">
              HAWKINS COGNITIVE CORE
            </h2>
            <p className="text-sm font-vt323 text-red-700/80 uppercase max-w-xl mx-auto tracking-widest leading-relaxed">
              OPERATE THE CRT TELEMETRY SYSTEM BELOW TO EVALUATE CURRENT MISSION PARAMETERS.
            </p>
          </div>

          <RetroTerminal />

        </div>
      </section>

      {/* SECTION 4: CALL TO ACTION */}
      <section className="py-32 px-6 relative z-20 border-t border-red-950/40 bg-gradient-to-b from-black to-[#0A0608]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-red-900/40 flex items-center justify-center mb-8 bg-red-950/20 text-glow-red">
            <Shield className="w-6 h-6 text-red-600 animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-garamond font-black text-white uppercase tracking-wider mb-8">
            WILL YOU CONQUER THE <br />
            <span className="text-red-600 stranger-title-glow">SHADOW?</span>
          </h2>
          <p className="text-lg font-garamond italic text-red-200/60 mb-12 max-w-2xl leading-relaxed">
            "Once you enter, your neural links are forged. Discipline is your only defense against the mind's decay. Do not let the portal shut."
          </p>
          <Link to="/signup" className="px-12 py-5 bg-red-700 hover:bg-red-600 text-white font-vt323 text-2xl tracking-[0.2em] rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(229,9,20,0.4)] border border-red-500/40 uppercase font-black">
            INITIALIZE YOUR COGNITIVE GATEWAY
          </Link>
        </div>
      </section>

      {/* Spooky Footer */}
      <footer className="py-12 border-t border-red-950/30 bg-[#050304] text-center relative z-20">
        <p className="font-vt323 text-red-900/60 text-base tracking-[0.25em] uppercase">
          © 2026 REARC OPERATIONAL DIVISION // DIVISION NO. 11 // ALL RIGHTS RESERVED
        </p>
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
