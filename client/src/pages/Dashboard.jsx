import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, Loader2, Zap, Brain, TrendingUp, ChevronRight, Activity, Bell, Play, Shield, Code, Server, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useArcStore } from '../store/arcStore';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { arc, loading, fetchDashboard } = useArcStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#030305]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!arc) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-6 bg-[#030305]">
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-4 relative">
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping"></div>
          <Target className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-white">No Active Arc Found</h2>
        <p className="text-textMuted max-w-md text-center">You haven't initialized your transformation sequence yet.</p>
        <Link to="/setup" className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          <span className="relative z-10 flex items-center gap-2">Initialize Now <ChevronRight className="w-5 h-5" /></span>
        </Link>
      </div>
    );
  }

  const todayDateStr = new Date().toDateString();
  const allTasks = arc.tasks || [];
  const todayTasks = allTasks.filter(t => new Date(t.date).toDateString() === todayDateStr);
  const completedTasks = todayTasks.filter(t => t.completed).length;
  const progress = todayTasks.length > 0 ? Math.round((completedTasks / todayTasks.length) * 100) : 0;

  const currentDay = Math.max(1, Math.floor((new Date() - new Date(arc.startDate)) / (1000 * 60 * 60 * 24)) + 1);
  const completedTotal = allTasks.filter(t => t.completed).length;

  // Discipline score: ratio of completed tasks to expected completed tasks so far
  const expectedByNow = allTasks.filter(t => new Date(t.date) <= new Date()).length;
  const cappedDisciplineScore = expectedByNow > 0 ? Math.min(100, Math.round((completedTotal / expectedByNow) * 100)) : 0;

  // Streak: count consecutive days backwards from today where at least 1 task was completed
  let dayStreak = 0;
  for (let i = 0; i < currentDay; i++) {
    const d = new Date(arc.startDate);
    d.setDate(d.getDate() + (currentDay - 1 - i));
    const dayTasks = allTasks.filter(t => new Date(t.date).toDateString() === d.toDateString());
    if (dayTasks.length > 0 && dayTasks.some(t => t.completed)) {
      dayStreak++;
    } else if (i > 0) {
      break; // streak broken
    }
  }

  // Weekly momentum: tasks completed per day this week
  const focusData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayTasksDone = allTasks.filter(t =>
      new Date(t.date).toDateString() === d.toDateString() && t.completed
    ).length;
    const dayTasksTotal = allTasks.filter(t =>
      new Date(t.date).toDateString() === d.toDateString()
    ).length;
    return { day: dayLabel, focus: dayTasksTotal > 0 ? Math.round((dayTasksDone / dayTasksTotal) * 100) : 0 };
  });

  const baseScore = Math.max(20, cappedDisciplineScore);
  const weakAreasList = arc.weakAreas ? arc.weakAreas.split(',').map(s => s.trim()).filter(Boolean) : ['Fundamentals'];
  const radarData = [
    { subject: (arc.targetField || 'Core').split(' ')[0], A: Math.min(100, baseScore + 15), fullMark: 100 },
    ...weakAreasList.slice(0, 4).map((area, i) => ({
      subject: area.split(' ')[0],
      A: Math.min(100, Math.max(10, baseScore - (i * 10))),
      fullMark: 100
    }))
  ];
  while (radarData.length < 4) {
    radarData.push({ subject: `Skill ${radarData.length}`, A: Math.max(10, baseScore - 5), fullMark: 100 });
  }


  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen bg-[#030305] text-white font-inter">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-textMuted font-medium text-lg">
          Welcome back, {user?.name?.split(' ')[0] || 'User'} <span className="inline-block animate-wave">👋</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-[#0A0A0F] border border-white/5 rounded-xl p-1 shadow-lg">
            <div className="flex items-center gap-2 px-4 py-1.5 border-r border-white/5">
              <Flame className="w-4 h-4 text-[#F97316] drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]" />
              <div>
                <div className="text-xs font-bold text-white leading-none">{dayStreak}</div>
                <div className="text-[9px] text-textMuted uppercase tracking-widest leading-none mt-1">Day Streak</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5">
              <Zap className="w-4 h-4 text-[#FCD34D] drop-shadow-[0_0_5px_rgba(252,211,77,0.8)]" />
              <div>
                <div className="text-xs font-bold text-white leading-none">{completedTasks}</div>
                <div className="text-[9px] text-textMuted uppercase tracking-widest leading-none mt-1">Done Today</div>
              </div>
            </div>
          </div>
          <button className="w-10 h-10 rounded-xl bg-[#0A0A0F] border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors shadow-lg">
            <Bell className="w-4 h-4 text-textMuted" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center shadow-lg">
             <span className="text-white font-bold text-sm">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 rounded-[2rem] relative overflow-hidden bg-[#050508] border border-white/5 min-h-[400px] flex flex-col justify-center p-12 group shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          {/* Background image simulated with gradients and unsplash */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-screen transition-transform duration-1000 group-hover:scale-105"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#030305] via-[#030305]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-transparent"></div>
          
          <div className="relative z-10 max-w-xl">
            <h1 className="text-6xl md:text-[5.5rem] font-black leading-[0.9] tracking-tighter mb-4">
              <span className="text-transparent bg-clip-text bg-[url('https://images.unsplash.com/photo-1550684848-FAC1C5B4E853?q=80&w=2000&auto=format&fit=crop')] bg-cover text-white drop-shadow-lg filter brightness-150">BUILD YOUR</span><br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">REDEMPTION ARC</span>
            </h1>
            <p className="text-xl text-white/80 font-medium mb-10 tracking-wide">Discipline today. Freedom forever.</p>
            
            <button className="group/btn relative rounded-2xl bg-[#11111A]/80 backdrop-blur-md border border-primary/30 p-1 pr-6 flex items-center gap-4 hover:bg-[#1A1A24] transition-all shadow-[0_0_20px_rgba(168,85,247,0.15)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primaryDark flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.5)] z-10">
                <Play className="w-5 h-5 text-white fill-white ml-1" />
              </div>
              <div className="z-10 py-2">
                <div className="text-[13px] font-bold text-white uppercase tracking-widest">Continue Mission</div>
                <div className="text-[11px] text-textMuted font-medium mt-0.5">Day {currentDay} • {arc.targetField}</div>
              </div>
            </button>
          </div>
          
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 text-right transform -rotate-2 opacity-80 mix-blend-screen hidden md:block">
            <p className="font-handwriting text-2xl text-white leading-relaxed">
              You're not<br/>here to be<br/>average.<br/>You're here to<br/><span className="text-[#F97316] text-3xl">be legendary.</span>
            </p>
          </div>
        </motion.div>

        {/* Right Side Cards (Score & Progress) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Discipline Score Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex-1 bg-[#0A0A0F] rounded-[2rem] p-6 border border-white/5 relative overflow-hidden shadow-lg flex flex-col items-center justify-center text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none"></div>
            <h3 className="text-[10px] font-bold text-textMuted tracking-[0.2em] uppercase absolute top-6 left-6">Discipline Score</h3>
            
            <div className="relative w-40 h-24 mt-6 flex justify-center overflow-hidden">
               <svg className="w-40 h-40 absolute top-0" viewBox="0 0 100 100">
                 <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeLinecap="round" />
                 <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * (cappedDisciplineScore/100))} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                 <defs>
                   <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#F97316" />
                     <stop offset="100%" stopColor="#A855F7" />
                   </linearGradient>
                 </defs>
               </svg>
               <div className="absolute bottom-0 flex flex-col items-center">
                 <span className="text-4xl font-black text-white">{cappedDisciplineScore}%</span>
                 <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest mt-1">Elite</span>
               </div>
            </div>
            
            <p className="text-xs text-textMuted font-medium mt-6">Keep going, you're in the top 8% <span className="text-[#FCD34D]">🏆</span></p>
          </motion.div>

          {/* Today's Progress Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex-1 bg-[#0A0A0F] rounded-[2rem] p-6 border border-white/5 shadow-lg relative">
            <h3 className="text-[10px] font-bold text-textMuted tracking-[0.2em] uppercase mb-6">Today's Progress</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F97316" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (progress / 100))} strokeLinecap="round" style={{transition: 'stroke-dashoffset 1s ease-out'}} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-white">{progress}%</span>
                  <span className="text-[8px] text-textMuted uppercase tracking-wider">Done</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center"><Activity className="w-3 h-3 text-emerald-500" /></div>
                  <span className="text-xs font-medium text-white">{completedTasks} of {todayTasks.length} tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center"><Target className="w-3 h-3 text-primary" /></div>
                  <span className="text-xs font-medium text-white">{completedTotal} total done</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mission Wide Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-8 bg-[#0A0A0F] rounded-[2rem] p-8 border border-white/5 relative overflow-hidden shadow-lg flex flex-col md:flex-row items-center gap-8 group">
          <div className="absolute top-0 right-0 w-[400px] h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
          
          <div className="flex-1 flex items-center gap-8 w-full z-10">
            {/* Day Circle */}
            <div className="relative w-28 h-28 shrink-0">
               <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#A855F7" strokeWidth="4" strokeDasharray="289" strokeDashoffset={289 * 0.8} strokeLinecap="round" />
               </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Day</span>
                 <span className="text-4xl font-black text-white leading-none my-1">{currentDay}</span>
                 <span className="text-[10px] text-textMuted font-medium">of 30</span>
               </div>
            </div>
            
            {/* Mission Details */}
            <div className="space-y-4 flex-1 border-r border-white/5 pr-8">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{arc.targetField}</h2>
                <p className="text-sm text-textMuted">Learn. Build. Ship.</p>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#151520] border border-white/5 flex items-center justify-center"><Code className="w-4 h-4 text-emerald-400" /></div>
                <div className="w-8 h-8 rounded-lg bg-[#151520] border border-white/5 flex items-center justify-center"><Server className="w-4 h-4 text-blue-400" /></div>
                <div className="w-8 h-8 rounded-lg bg-[#151520] border border-white/5 flex items-center justify-center"><Shield className="w-4 h-4 text-orange-400" /></div>
              </div>
            </div>

            {/* Current Task */}
            <div className="flex-1 pl-4 space-y-4">
              <div>
                <div className="text-[10px] font-bold text-textMuted tracking-[0.2em] uppercase mb-1">Current Task</div>
                <h3 className="text-sm font-bold text-white pr-4">{todayTasks.find(t => !t.completed)?.description || todayTasks[0]?.description || 'All tasks complete!'}</h3>
              </div>
              <div className="flex items-center gap-4">
                <Link to={`/mission/${currentDay}`} className="bg-gradient-to-r from-primary to-purple-700 px-6 py-1.5 rounded-lg text-xs font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform inline-flex items-center gap-1">
                  <Play className="w-3 h-3 fill-white" /> Resume
                </Link>
              </div>
            </div>
          </div>

          {/* Glowing 3D Cube representation via CSS */}
          <div className="shrink-0 relative w-32 h-32 mr-4 md:mr-12 z-10 hidden md:block">
            <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full animate-pulse-fast"></div>
            {/* Rings */}
            <div className="absolute bottom-0 w-full h-8 border border-primary/40 rounded-[100%] transform -rotate-12"></div>
            <div className="absolute bottom-1 w-full h-8 border border-primary/20 rounded-[100%] transform rotate-12"></div>
            {/* The Cube (CSS isometric) */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16">
               <div className="absolute w-full h-full border-2 border-primary/80 shadow-[0_0_15px_rgba(168,85,247,0.8)] rounded-sm transform rotate-45 skew-x-[15deg] skew-y-[15deg] bg-[#0A0A0F]/50 backdrop-blur-sm"></div>
               <div className="absolute w-10 h-10 border-2 border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.8)] rounded-sm transform rotate-45 skew-x-[15deg] skew-y-[15deg] top-3 left-3 bg-white/10"></div>
            </div>
          </div>
        </motion.div>

        {/* AI Mentor Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-4 bg-[#0A0A0F] rounded-[2rem] p-6 border border-white/5 relative overflow-hidden shadow-lg flex flex-col justify-between">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-screen mix-blend-luminosity"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/80 to-transparent"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[40px] rounded-full"></div>
          
          <h3 className="text-[10px] font-bold text-textMuted tracking-[0.2em] uppercase mb-4 relative z-10">AI Mentor Insight</h3>
          
          <div className="relative z-10 mt-20">
             <p className="text-sm text-white/90 font-medium leading-relaxed mb-4">
               {dayStreak > 2 
                 ? `You're on a ${dayStreak}-day streak! Your consistency is building incredible momentum.`
                 : progress > 50 
                 ? "You're making solid progress today. Keep pushing through the friction."
                 : "Every day is a new opportunity. Focus on your deep work sessions today."}
             </p>
             <button className="flex items-center gap-2 text-xs font-bold text-primary hover:text-white transition-colors bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 backdrop-blur-md">
               Talk to Mentor <ChevronRight className="w-3 h-3" />
             </button>
          </div>
        </motion.div>

        {/* Bottom Row Grids */}
        
        {/* Weekly Momentum Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-5 bg-[#0A0A0F] rounded-[2rem] p-6 border border-white/5 shadow-lg relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-bold text-textMuted tracking-[0.2em] uppercase">Weekly Momentum</h3>
            <select className="bg-transparent border-none text-xs text-textMuted font-bold focus:outline-none cursor-pointer">
              <option>This Week</option>
            </select>
          </div>
          <div className="h-[160px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={focusData} margin={{top: 10, right: 0, left: -20, bottom: 0}}>
                <defs>
                  <linearGradient id="colorFocusArea" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity={0.3}/>
                    <stop offset="50%" stopColor="#F97316" stopOpacity={0.2}/>
                    <stop offset="100%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.1)" tick={{fill: '#94A3B8', fontSize: 10}} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{backgroundColor: '#11111A', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px'}} cursor={false} />
                <Area type="monotone" dataKey="focus" stroke="url(#scoreGrad)" strokeWidth={3} fillOpacity={1} fill="url(#colorFocusArea)" activeDot={{r: 6, fill: '#F97316', stroke: '#fff', strokeWidth: 2}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Skill Radar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-3 bg-[#0A0A0F] rounded-[2rem] p-6 border border-white/5 shadow-lg flex flex-col items-center relative overflow-hidden">
          <h3 className="text-[10px] font-bold text-textMuted tracking-[0.2em] uppercase self-start absolute top-6 left-6">Skill Radar</h3>
          <div className="h-[200px] w-full mt-4">
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
                 <PolarGrid stroke="rgba(255,255,255,0.05)" />
                 <PolarAngleAxis dataKey="subject" tick={{fill: '#94A3B8', fontSize: 9}} />
                 <Radar name="Skills" dataKey="A" stroke="#A855F7" strokeWidth={2} fill="#A855F7" fillOpacity={0.2} />
               </RadarChart>
             </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Focus Time Bars */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-4 bg-[#0A0A0F] rounded-[2rem] p-6 border border-white/5 shadow-lg relative">
          <h3 className="text-[10px] font-bold text-textMuted tracking-[0.2em] uppercase mb-2">Task Completion Rate (This Week)</h3>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-2xl font-bold text-white">{focusData.reduce((s,d)=>s+d.focus,0)}%</span>
            <span className="text-xs text-emerald-500 font-bold">weekly avg</span>
          </div>
          <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={focusData} margin={{top: 0, right: 0, left: -20, bottom: 0}}>
                <defs>
                   <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
                     <stop offset="0%" stopColor="#A855F7" stopOpacity={0.4}/>
                     <stop offset="100%" stopColor="#F97316" stopOpacity={1}/>
                   </linearGradient>
                 </defs>
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.1)" tick={{fill: '#94A3B8', fontSize: 10}} tickLine={false} axisLine={false} />
                <Bar dataKey="focus" fill="url(#barGrad)" radius={[4, 4, 4, 4]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="lg:col-span-8 bg-[#0A0A0F] rounded-[2rem] p-6 border border-white/5 shadow-lg relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-bold text-textMuted tracking-[0.2em] uppercase">Recent Achievements</h3>
            <button className="text-xs text-primary font-bold hover:text-white transition-colors">View All</button>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 bg-[#11111A] border border-white/5 p-3 rounded-2xl flex-1 min-w-[200px]">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500 text-glow-amber" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{dayStreak > 0 ? `${dayStreak} Day Streak` : 'Start Streak'}</div>
                <div className="text-[10px] text-textMuted mt-0.5 font-medium">{dayStreak > 0 ? 'Keep it up!' : 'Complete a task today'}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-[#11111A] border border-white/5 p-3 rounded-2xl flex-1 min-w-[200px]">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Rank {user?.level || 1}</div>
                <div className="text-[10px] text-textMuted mt-0.5 font-medium">{user?.xp || 0} XP Total</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#11111A] border border-white/5 p-3 rounded-2xl flex-1 min-w-[200px]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{completedTotal} Tasks</div>
                <div className="text-[10px] text-textMuted mt-0.5 font-medium">Total completed</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Motivation Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="lg:col-span-4 rounded-[2rem] relative overflow-hidden group shadow-[0_0_30px_rgba(249,115,22,0.15)] flex flex-col justify-end p-6 border border-white/5 min-h-[160px]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-screen transition-transform duration-1000 group-hover:scale-110"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#030305]/80 to-transparent"></div>
          
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white leading-tight mb-2">Every day you show up,<br/>you rewrite your story.</h3>
            <p className="text-[10px] text-white/60 font-medium uppercase tracking-[0.2em]">Make today count.</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

