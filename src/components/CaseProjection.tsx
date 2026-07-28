import React from 'react';
import { projectCases, HISTORICAL_TOTAL, HISTORICAL_RATE } from '../data/tphisData';
import { TrendingUp, Calendar, AlertCircle } from 'lucide-react';

interface CaseProjectionProps {
  years: number;
  onSelectYears: (years: number) => void;
  onAskAIAboutProjection?: () => void;
}

export const CaseProjection: React.FC<CaseProjectionProps> = ({
  years,
  onSelectYears,
  onAskAIAboutProjection,
}) => {
  const projectedTotal = projectCases(HISTORICAL_TOTAL, years);
  const projectedPositive = Math.round(projectedTotal * (HISTORICAL_RATE / 100));
  const projectedNegative = projectedTotal - projectedPositive;
  const growthCount = projectedTotal - HISTORICAL_TOTAL;
  const growthPercent = Math.round((growthCount / HISTORICAL_TOTAL) * 100);

  return (
    <div className="immersive-card rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Case Projection Model
            </h2>
            <p className="text-xs text-slate-400">
              Cross-sectional prevalence projection based on 5% compounding annual growth
            </p>
          </div>
        </div>

        {/* Time Horizon Selector */}
        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
          {[1, 2, 3].map((y) => (
            <button
              key={y}
              onClick={() => onSelectYears(y)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                years === y
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {y * 12} Months ({y} yr)
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Main projection hero number */}
        <div className="bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-black/60 border border-indigo-500/30 rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <Calendar className="w-3 h-3" /> {years * 12}-Month Horizon
            </span>
          </div>

          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Forecasted Case Burden
          </p>
          <div className="text-5xl font-black text-white tracking-tight my-2">
            {projectedTotal}
          </div>
          <p className="text-xs text-slate-300 font-medium flex items-center justify-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-rose-400" />
            <span className="text-rose-400 font-bold">+{growthCount} cases</span> (+{growthPercent}% increase)
          </p>
        </div>

        {/* Breakdown Positive vs Negative */}
        <div className="space-y-3 bg-white/[0.02] border border-white/10 rounded-2xl p-5">
          <div className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider text-[11px]">
            Projected Outcome Breakdown
          </div>

          <div className="flex items-center justify-between text-sm font-medium bg-black/40 p-3 rounded-xl border border-rose-500/20">
            <span className="flex items-center gap-2 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Projected Positive
            </span>
            <span className="text-lg font-bold text-white">{projectedPositive}</span>
          </div>

          <div className="flex items-center justify-between text-sm font-medium bg-black/40 p-3 rounded-xl border border-emerald-500/20">
            <span className="flex items-center gap-2 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Projected Negative
            </span>
            <span className="text-lg font-bold text-white">{projectedNegative}</span>
          </div>
        </div>

        {/* Interpretation & Quick Ask AI */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2">
              <AlertCircle className="w-4 h-4" />
              Epidemiological Trend Alert
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Without active intervention, total cases across Koronadal City are projected to grow from <strong className="text-white">{HISTORICAL_TOTAL}</strong> to <strong className="text-white">{projectedTotal}</strong> over {years * 12} months.
            </p>
          </div>

          {onAskAIAboutProjection && (
            <button
              onClick={onAskAIAboutProjection}
              className="mt-4 w-full py-2.5 px-4 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold rounded-xl border border-indigo-500/40 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              Ask Gemini AI for {years * 12}-Month Forecast Analysis →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
