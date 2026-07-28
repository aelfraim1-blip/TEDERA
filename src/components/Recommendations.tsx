import React from 'react';
import { Lightbulb, Droplets, Hand, Activity, ShieldCheck } from 'lucide-react';

export const Recommendations: React.FC = () => {
  return (
    <div className="immersive-card rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">💡 Key Strategic Recommendations</h2>
          <p className="text-xs text-slate-400">
            Core community health measures to suppress transmission across Koronadal City
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 transition-all hover:border-indigo-500/40 hover:bg-white/[0.04]">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg w-fit mb-3 border border-indigo-500/20">
            <Droplets className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Water Quality Sanitation</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Conduct routine water sampling and point-of-use chlorination across barangay communal pumps.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 transition-all hover:border-emerald-500/40 hover:bg-white/[0.04]">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg w-fit mb-3 border border-emerald-500/20">
            <Hand className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Hygiene Infrastructure</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Expand soap and water handwashing stations at barangay halls, public markets, and schools.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 transition-all hover:border-amber-500/40 hover:bg-white/[0.04]">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg w-fit mb-3 border border-amber-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Disease Surveillance</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Strengthen real-time case logging and contact tracing between Rural Health Units and TPHIS.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 transition-all hover:border-purple-500/40 hover:bg-white/[0.04]">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg w-fit mb-3 border border-purple-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Community Outreach</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Deploy Barangay Health Workers (BHWs) for door-to-door sanitation and hydration awareness.
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
        Projection Confidence: <strong className="text-slate-200">MODERATE</strong> | TPHIS cross-sectional prevalence-based model with 5% annual compounding growth.
      </div>
    </div>
  );
};
