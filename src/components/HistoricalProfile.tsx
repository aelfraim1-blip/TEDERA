import React from 'react';
import { HISTORICAL_TOTAL, HISTORICAL_POSITIVE, HISTORICAL_NEGATIVE, HISTORICAL_RATE } from '../data/tphisData';
import { Database, CheckCircle2, XCircle, Percent } from 'lucide-react';

export const HistoricalProfile: React.FC = () => {
  return (
    <div className="immersive-card rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Historical Disease Profile</h2>
            <p className="text-xs text-slate-400">Baseline epidemiological registry for Koronadal City</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-white/5 text-slate-300 text-xs font-semibold rounded-full border border-white/10">
          Koronadal Registry
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 transition-all hover:bg-white/[0.04]">
          <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Total Recorded Cases</div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{HISTORICAL_TOTAL}</div>
          <p className="text-xs text-slate-500 mt-2">Comprehensive test samples</p>
        </div>

        <div className="bg-white/[0.02] border border-rose-500/20 rounded-xl p-4 transition-all hover:border-rose-500/40 hover:bg-rose-500/[0.02]">
          <div className="flex items-center justify-between text-[11px] text-rose-400 font-semibold uppercase tracking-wider mb-1">
            <span>Positive Cases</span>
            <CheckCircle2 className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 tracking-tight">{HISTORICAL_POSITIVE}</div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full"
              style={{ width: `${(HISTORICAL_POSITIVE / HISTORICAL_TOTAL) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white/[0.02] border border-emerald-500/20 rounded-xl p-4 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/[0.02]">
          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold uppercase tracking-wider mb-1">
            <span>Negative Cases</span>
            <XCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">{HISTORICAL_NEGATIVE}</div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${(HISTORICAL_NEGATIVE / HISTORICAL_TOTAL) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white/[0.02] border border-amber-500/20 rounded-xl p-4 transition-all hover:border-amber-500/40 hover:bg-amber-500/[0.02]">
          <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold uppercase tracking-wider mb-1">
            <span>Positivity Rate</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 tracking-tight">{HISTORICAL_RATE.toFixed(1)}%</div>
          <p className="text-xs text-slate-400 mt-2">Tested positive ratio</p>
        </div>
      </div>
    </div>
  );
};
