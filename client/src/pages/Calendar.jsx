import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useArcStore } from '../store/arcStore';
import { Link } from 'react-router-dom';
import { CheckCircle2, Flame, Target, Calendar as CalendarIcon, ChevronRight, Lock } from 'lucide-react';

export default function Calendar() {
  const { arc } = useArcStore();

  const days = useMemo(() => {
    if (!arc) return [];
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(arc.startDate);
      d.setDate(d.getDate() + i);
      const dayTasks = arc.tasks?.filter(t =>
        new Date(t.date).toDateString() === d.toDateString()
      ) || [];
      const completedCount = dayTasks.filter(t => t.completed).length;
      const totalCount = dayTasks.length;
      const isCompleted = totalCount > 0 && completedCount === totalCount;
      const isPartial = completedCount > 0 && completedCount < totalCount;
      const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
      return { date: d, dayTasks, completedCount, totalCount, isCompleted, isPartial, progress };
    });
  }, [arc]);

  if (!arc) {
    return (
      <div className="min-h-screen bg-[#030305] flex flex-col items-center justify-center space-y-6 p-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Target className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-white">No Active Arc</h2>
        <p className="text-[#94A3B8] text-center max-w-md">Initialize your transformation sequence to unlock your 30-day mission calendar.</p>
        <Link to="/setup" className="flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white font-bold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          Initialize Arc <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  const today = new Date();
  const currentDayIndex = Math.floor((today - new Date(arc.startDate)) / (1000 * 60 * 60 * 24));
  const totalCompleted = arc.tasks?.filter(t => t.completed).length || 0;
  const totalTasks = arc.tasks?.length || 0;
  const overallProgress = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#030305] p-6 md:p-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-[10px] font-bold text-primary/80 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
              <CalendarIcon className="w-3 h-3" /> 30-Day Arc Schedule
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Calendar</span>
            </h1>
            <p className="text-[#64748B] mt-2 font-medium">
              Arc: <span className="text-[#94A3B8] font-bold">{arc.targetField}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-[#0A0A0F] border border-white/5 rounded-2xl px-5 py-4 text-center">
              <div className="text-2xl font-black text-white">{currentDayIndex + 1}</div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-widest font-bold mt-1">Current Day</div>
            </div>
            <div className="bg-[#0A0A0F] border border-primary/20 rounded-2xl px-5 py-4 text-center shadow-[0_0_20px_rgba(168,85,247,0.1)]">
              <div className="text-2xl font-black text-primary">{overallProgress}%</div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-widest font-bold mt-1">Complete</div>
            </div>
            <div className="bg-[#0A0A0F] border border-orange-500/20 rounded-2xl px-5 py-4 text-center shadow-[0_0_20px_rgba(249,115,22,0.1)]">
              <div className="text-2xl font-black text-orange-400 flex items-center gap-1 justify-center">
                <Flame className="w-5 h-5 fill-orange-400" />
                {totalCompleted}
              </div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-widest font-bold mt-1">Done</div>
            </div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mt-6 h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {days.map(({ date, dayTasks, completedCount, totalCount, isCompleted, isPartial, progress }, i) => {
          const isToday = date.toDateString() === today.toDateString();
          const isFuture = date > today;
          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
          const dayNum = i + 1;

          return (
            <Link
              to={isFuture ? '#' : `/mission/${dayNum}`}
              key={i}
              onClick={(e) => isFuture && e.preventDefault()}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.015 }}
                whileHover={!isFuture ? { scale: 1.04, y: -2 } : {}}
                className={`relative h-36 rounded-2xl p-4 border overflow-hidden cursor-pointer transition-all duration-300 ${
                  isToday
                    ? 'border-primary/40 bg-gradient-to-br from-primary/15 to-transparent shadow-[0_0_25px_rgba(168,85,247,0.2)] z-10'
                    : isCompleted
                    ? 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/30'
                    : isPartial
                    ? 'border-orange-500/20 bg-orange-500/5 hover:border-orange-500/30'
                    : isFuture
                    ? 'border-white/5 bg-[#06060A] opacity-50 cursor-not-allowed'
                    : 'border-white/5 bg-[#0A0A0F] hover:border-white/10'
                }`}
              >
                {/* Top bar */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] ${
                  isToday ? 'bg-gradient-to-r from-primary via-secondary to-primary' :
                  isCompleted ? 'bg-emerald-500/60' :
                  isPartial ? 'bg-orange-500/40' : 'bg-transparent'
                }`} />

                {/* Day number */}
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs font-black uppercase tracking-widest ${
                    isToday ? 'text-primary' : isCompleted ? 'text-emerald-400' : 'text-[#475569]'
                  }`}>
                    Day {dayNum}
                  </span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />}
                  {isToday && <Flame className="w-4 h-4 text-orange-400 fill-orange-400 shrink-0 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />}
                  {isFuture && !isToday && <Lock className="w-3 h-3 text-[#1E293B] shrink-0" />}
                </div>

                {/* Date */}
                <div className="text-[11px] text-[#334155] font-medium mb-2">
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>

                {/* Task count */}
                {totalCount > 0 && !isFuture && (
                  <div className="text-[10px] text-[#475569] font-medium">
                    {completedCount}/{totalCount} tasks
                  </div>
                )}

                {/* Progress bar */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isToday ? 'bg-gradient-to-r from-primary to-secondary shadow-[0_0_6px_rgba(168,85,247,0.6)]' :
                        isCompleted ? 'bg-emerald-500' :
                        isPartial ? 'bg-orange-400' : 'bg-transparent'
                      }`}
                      style={{ width: `${isToday ? progress || 20 : progress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
