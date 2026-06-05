import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useArcStore } from '../store/arcStore';
import { useAuthStore } from '../store/authStore';
import {
  ChevronLeft, Play, Square, CheckCircle2, Clock, Zap,
  Brain, Star, Loader2, X, Check, AlertTriangle, Timer,
  Circle, Trophy, ChevronRight
} from 'lucide-react';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function DailyMission() {
  const { dayId } = useParams();
  const { arc, verifyTask, toggleTask } = useArcStore();
  const { user } = useAuthStore();

  const [activeTimer, setActiveTimer] = useState(null);
  const [timers, setTimers] = useState({});
  const [verifyModal, setVerifyModal] = useState(null); // taskId
  const [verifyAnswer, setVerifyAnswer] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyError, setVerifyError] = useState('');
  const [levelUpAnim, setLevelUpAnim] = useState(false);
  const intervalRef = useRef(null);

  const dayIndex = dayId === 'today'
    ? Math.max(0, Math.floor((new Date() - new Date(arc?.startDate)) / (1000 * 60 * 60 * 24)))
    : parseInt(dayId) - 1;

  const displayDay = dayIndex + 1;

  let tasks = [];
  let missionDateStr = 'Mission';
  if (arc?.tasks) {
    const missionDate = new Date(arc.startDate);
    missionDate.setDate(missionDate.getDate() + dayIndex);
    missionDateStr = missionDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    tasks = arc.tasks.filter(t => new Date(t.date).toDateString() === missionDate.toDateString());
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  // Timer logic
  useEffect(() => {
    if (activeTimer) {
      intervalRef.current = setInterval(() => {
        setTimers(prev => ({ ...prev, [activeTimer]: (prev[activeTimer] || 0) + 1 }));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [activeTimer]);

  const handleTimerToggle = (taskId) => {
    if (activeTimer === taskId) {
      setActiveTimer(null);
    } else {
      setActiveTimer(taskId);
      if (!timers[taskId]) setTimers(prev => ({ ...prev, [taskId]: 0 }));
    }
  };

  const handleToggleTask = async (taskId) => {
    await toggleTask(taskId);
  };

  const openVerify = (taskId) => {
    setVerifyModal(taskId);
    setVerifyAnswer('');
    setVerifyResult(null);
    setVerifyError('');
  };

  const handleVerifySubmit = async () => {
    if (!verifyAnswer.trim()) return;
    setVerifyLoading(true);
    setVerifyError('');
    try {
      const prevLevel = user?.level;
      const data = await verifyTask(verifyModal, verifyAnswer);
      setVerifyResult(data);
      if (data.result?.isAccepted && user?.level > prevLevel) {
        setLevelUpAnim(true);
        setTimeout(() => setLevelUpAnim(false), 3000);
      }
    } catch (err) {
      setVerifyError(err.response?.data?.error || err.message || 'Verification failed');
    } finally {
      setVerifyLoading(false);
    }
  };

  if (!arc) {
    return (
      <div className="min-h-screen bg-[#030305] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white">No Arc Active</h2>
          <Link to="/setup" className="inline-flex items-center gap-2 bg-primary text-black font-bold px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            Initialize Arc <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#030305] transition-all duration-700 ${activeTimer ? 'bg-black' : ''}`}>
      {/* Focus Mode Overlay */}
      <AnimatePresence>
        {activeTimer && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Level Up Animation */}
      <AnimatePresence>
        {levelUpAnim && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -100 }}
            className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none"
          >
            <div className="bg-[#0A0A0F] border border-primary/40 rounded-3xl p-12 text-center shadow-[0_0_60px_rgba(168,85,247,0.5)]">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
              <div className="text-5xl font-black text-white mb-2">LEVEL UP!</div>
              <div className="text-primary text-lg font-bold">You are now Rank {user?.level}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 md:p-10 max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link to="/calendar" className="flex items-center gap-2 text-sm text-[#64748B] hover:text-white transition-colors font-medium">
            <ChevronLeft className="w-4 h-4" /> Back to Schedule
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">{tasks.length * 30} XP Available</span>
            </div>
          </div>
        </div>

        {/* Mission Title */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-bold text-primary/80 uppercase tracking-[0.3em]">Day {displayDay} Mission</span>
            <span className="text-[10px] text-[#64748B] uppercase tracking-widest">{missionDateStr}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
            {arc.targetField} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Protocol</span>
          </h1>

          {/* Progress Bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <span className="text-sm font-bold text-white shrink-0">{completedCount}/{tasks.length} complete</span>
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-4">
          {tasks.map((task, i) => {
            const isRunning = activeTimer === task.id;
            const elapsed = timers[task.id] || 0;

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: activeTimer && !isRunning ? 0.4 : 1,
                  y: 0,
                  scale: isRunning ? 1.01 : 1,
                }}
                transition={{ delay: i * 0.06 }}
                className={`relative rounded-2xl border overflow-hidden transition-all duration-500 ${
                  task.completed
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : isRunning
                    ? 'border-primary/40 bg-[#0A0A0F] shadow-[0_0_30px_rgba(168,85,247,0.15)]'
                    : 'border-white/5 bg-[#0A0A0F] hover:border-white/10'
                }`}
              >
                {/* Active indicator stripe */}
                {isRunning && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary to-secondary" />
                )}

                <div className="p-5 md:p-7">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                    {/* Left: checkbox + info */}
                    <div className="flex items-start gap-4 flex-1">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="mt-0.5 shrink-0 group"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                        ) : (
                          <Circle className="w-6 h-6 text-[#334155] group-hover:text-primary transition-colors" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-[#64748B] flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3" /> {task.time}
                          </span>
                          {task.aiVerified && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary font-bold uppercase tracking-wider">
                              AI Verified ✓
                            </span>
                          )}
                        </div>
                        <h3 className={`text-[17px] font-bold tracking-tight ${task.completed ? 'text-[#475569] line-through' : 'text-white'}`}>
                          {task.description}
                        </h3>
                        {task.aiVerified && task.confidenceScore && (
                          <div className="mt-1 text-xs text-emerald-400 font-medium">
                            Score: {task.confidenceScore}/100 · XP Earned
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: timer + verify */}
                    <div className="flex items-center gap-2 shrink-0 pl-10 md:pl-0">
                      {isRunning && (
                        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-2 rounded-xl">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span className="font-mono text-sm text-primary font-bold">{formatTime(elapsed)}</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleTimerToggle(task.id)}
                        disabled={task.completed}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                          isRunning
                            ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        {isRunning ? <><Square className="w-3 h-3" /> Stop</> : <><Play className="w-3 h-3 fill-current" /> Focus</>}
                      </button>
                      {!task.completed && (
                        <button
                          onClick={() => openVerify(task.id)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all"
                        >
                          <Brain className="w-3 h-3" /> Verify
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* AI Verify Modal */}
      <AnimatePresence>
        {verifyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && !verifyLoading && setVerifyModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#0A0A0F] border border-primary/20 rounded-3xl p-8 max-w-xl w-full shadow-[0_0_60px_rgba(168,85,247,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg uppercase tracking-wide">AI Verification</h3>
                    <p className="text-xs text-[#64748B] font-medium">Prove your understanding for XP</p>
                  </div>
                </div>
                {!verifyLoading && (
                  <button onClick={() => setVerifyModal(null)} className="text-[#475569] hover:text-white transition-colors p-1">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="bg-white/5 border border-white/5 rounded-xl p-4 mb-5 relative z-10">
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">Task</p>
                <p className="text-white font-medium text-sm">
                  {tasks.find(t => t.id === verifyModal)?.description}
                </p>
              </div>

              {!verifyResult ? (
                <div className="relative z-10">
                  <label className="block text-xs font-bold text-[#64748B] uppercase tracking-widest mb-3">
                    Explain what you learned / built / solved
                  </label>
                  <textarea
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-[#334155] focus:outline-none focus:border-primary/50 transition-colors resize-none mb-4"
                    rows={5}
                    placeholder="I implemented a two-pointer approach which reduced time complexity from O(n²) to O(n) by..."
                    value={verifyAnswer}
                    onChange={e => setVerifyAnswer(e.target.value)}
                    disabled={verifyLoading}
                  />
                  {verifyError && (
                    <div className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      {verifyError}
                    </div>
                  )}
                  <button
                    onClick={handleVerifySubmit}
                    disabled={verifyLoading || !verifyAnswer.trim()}
                    className="w-full bg-gradient-to-r from-primary to-purple-600 text-white font-black py-4 rounded-xl text-sm uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2"
                  >
                    {verifyLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Zap className="w-4 h-4" /> Submit for AI Review</>}
                  </button>
                </div>
              ) : (
                <div className="relative z-10 space-y-4">
                  {verifyResult.result?.isAccepted ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-center">
                      <Check className="w-10 h-10 text-emerald-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                      <div className="text-2xl font-black text-white mb-1">VERIFIED</div>
                      <div className="text-emerald-400 text-sm font-bold mb-3">Score: {verifyResult.result?.score}/100 · +{verifyResult.xpEarned} XP</div>
                      <p className="text-sm text-[#94A3B8] italic">"{verifyResult.result?.feedback}"</p>
                    </div>
                  ) : (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-center">
                      <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                      <div className="text-2xl font-black text-white mb-1">NOT ACCEPTED</div>
                      <p className="text-sm text-[#94A3B8] italic mb-2">"{verifyResult.result?.feedback}"</p>
                      <p className="text-xs text-red-400">"{verifyResult.result?.advice}"</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    {verifyResult.result?.strengths?.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-2">
                        <Check className="w-3 h-3 shrink-0" /> {s}
                      </div>
                    ))}
                    {verifyResult.result?.weaknesses?.map((w, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-orange-400 bg-orange-500/5 border border-orange-500/10 rounded-lg p-2">
                        <AlertTriangle className="w-3 h-3 shrink-0" /> {w}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setVerifyModal(null)}
                    className="w-full bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl text-sm hover:bg-white/10 transition-all"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
