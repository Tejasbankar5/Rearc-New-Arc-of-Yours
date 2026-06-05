import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, Brain, AlertCircle, Loader2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArcStore } from '../store/arcStore';

export default function SetupWizard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ targetField: '', goals: '', availableHours: 4, weakAreas: '' });
  const { generateArc: generateArcStore, loading, error, setupConfig, fetchSetupConfig } = useArcStore();

  useEffect(() => {
    fetchSetupConfig();
  }, [fetchSetupConfig]);

  const handleGenerateArc = async () => {
    if (!formData.targetField || !formData.goals) return;
    try {
      await generateArcStore(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  if (!setupConfig) {
    return (
      <div className="min-h-screen bg-[#030305] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#A855F7] animate-spin" />
      </div>
    );
  }

  const { presets, placeholders, labels } = setupConfig;

  return (
    <div className="min-h-screen bg-[#030305] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[rgba(168,85,247,0.08)] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[rgba(249,115,22,0.05)] rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-2xl w-full relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[rgba(168,85,247,0.1)] border border-[rgba(168,85,247,0.2)] px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4 text-[#A855F7]" />
            <span className="text-xs font-bold text-[#A855F7] uppercase tracking-widest">Arc Initialization Protocol</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-3">
            {labels.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#F97316]">Arc</span>
          </h1>
          <p className="text-[#64748B] text-base max-w-md mx-auto">
            {labels.subtitle}
          </p>
        </div>

        <div className="bg-[#0A0A0F] border border-[rgba(255,255,255,0.06)] rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(168,85,247,0.5)] to-transparent" />

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-[#64748B] uppercase tracking-widest mb-3">
                <Target className="w-3.5 h-3.5 text-[#A855F7]" /> Target Field
              </label>
              <input
                type="text"
                placeholder={placeholders.targetField}
                className="w-full bg-[#030305] border border-[rgba(255,255,255,0.08)] rounded-2xl px-5 py-4 text-white placeholder:text-[#334155] focus:outline-none focus:border-[rgba(168,85,247,0.4)] transition-all text-sm"
                value={formData.targetField}
                onChange={(e) => setFormData({ ...formData, targetField: e.target.value })}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {presets.map(p => (
                  <button
                    key={p}
                    onClick={() => setFormData({ ...formData, targetField: p })}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-medium ${
                      formData.targetField === p
                        ? 'bg-[rgba(168,85,247,0.2)] border-[rgba(168,85,247,0.4)] text-[#A855F7]'
                        : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.06)] text-[#64748B] hover:border-[rgba(255,255,255,0.15)] hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-[#64748B] uppercase tracking-widest mb-3">
                <Brain className="w-3.5 h-3.5 text-[#F97316]" /> Primary Goals (1 Month)
              </label>
              <textarea
                rows={3}
                placeholder={placeholders.goals}
                className="w-full bg-[#030305] border border-[rgba(255,255,255,0.08)] rounded-2xl px-5 py-4 text-white placeholder:text-[#334155] focus:outline-none focus:border-[rgba(249,115,22,0.4)] transition-all text-sm resize-none"
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-[#64748B] uppercase tracking-widest mb-3">
                  <Clock className="w-3.5 h-3.5 text-blue-400" /> Daily Hours
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range" min="1" max="12" step="1"
                    value={formData.availableHours}
                    onChange={(e) => setFormData({ ...formData, availableHours: parseInt(e.target.value) })}
                    className="flex-1 accent-[#A855F7]"
                  />
                  <span className="text-white font-black text-lg w-8 text-center">{formData.availableHours}h</span>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-[#64748B] uppercase tracking-widest mb-3">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" /> Weak Areas
                </label>
                <input
                  type="text"
                  placeholder={placeholders.weakAreas}
                  className="w-full bg-[#030305] border border-[rgba(255,255,255,0.08)] rounded-2xl px-4 py-3 text-white placeholder:text-[#334155] focus:outline-none focus:border-red-400/40 transition-all text-sm"
                  value={formData.weakAreas}
                  onChange={(e) => setFormData({ ...formData, weakAreas: e.target.value })}
                />
              </div>
            </div>

            <button
              onClick={handleGenerateArc}
              disabled={loading || !formData.targetField || !formData.goals}
              className="w-full mt-4 bg-gradient-to-r from-[#A855F7] to-[#7E22CE] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-40 shadow-[0_0_30px_rgba(168,85,247,0.3)] text-sm uppercase tracking-widest"
            >
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating 30-Day Arc with AI...</>
                : <><Target className="w-5 h-5" /> Initialize Transformation</>
              }
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
