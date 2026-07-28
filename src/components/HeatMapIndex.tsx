import React from 'react';
import { BarangayComputed } from '../types';
import { heatColor } from '../data/tphisData';
import { Flame, Info } from 'lucide-react';

interface HeatMapIndexProps {
  barangays: BarangayComputed[];
  onSelectCommunity?: (b: BarangayComputed) => void;
}

export const HeatMapIndex: React.FC<HeatMapIndexProps> = ({
  barangays,
  onSelectCommunity,
}) => {
  const sortedBarangays = [...barangays].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="immersive-card rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">🌡️ Community Heat Map Index</h2>
            <p className="text-xs text-slate-400">
              Composite risk index (0–100) combining disease burden (35%), projected growth (35%), positivity rate (20%), and community size (10%).
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {sortedBarangays.map((b) => {
          const bgColor = heatColor(b.riskScore);
          return (
            <div
              key={b.id}
              onClick={() => onSelectCommunity?.(b)}
              style={{ backgroundColor: bgColor }}
              className="p-5 rounded-2xl shadow-xl border border-white/20 transition-all transform hover:-translate-y-1 cursor-pointer text-white relative overflow-hidden"
            >
              <div className="text-xs font-semibold drop-shadow mb-1 opacity-90 truncate">
                📍 {b.name}
              </div>
              <div className="text-3xl font-black tracking-tight drop-shadow">
                {b.riskScore} <span className="text-sm font-semibold opacity-80">/ 100</span>
              </div>
              <div className="text-xs font-bold tracking-wide uppercase mt-1 drop-shadow opacity-95">
                {b.riskLabel} RISK INDEX
              </div>
              <div className="text-[11px] mt-3 pt-2 border-t border-white/20 opacity-90 drop-shadow flex justify-between">
                <span>{b.cases} projected cases</span>
                <span>{b.rate}% positivity</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40 p-4 rounded-xl border border-white/10 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Shaded gradient scale interpolates individual barangay risk scores dynamically.</span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="w-64 h-3 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 via-orange-500 to-red-600" />
          <div className="flex justify-between w-64 text-[10px] text-slate-400 font-medium">
            <span>0 Low</span>
            <span>40 Mod</span>
            <span>70 High</span>
            <span>100 Very High</span>
          </div>
        </div>
      </div>
    </div>
  );
};
