import React from 'react';
import { BarangayComputed } from '../types';
import { ShieldAlert, MapPin, ChevronRight } from 'lucide-react';

interface RiskCommunitiesProps {
  barangays: BarangayComputed[];
  onSelectCommunity?: (b: BarangayComputed) => void;
}

export const RiskCommunities: React.FC<RiskCommunitiesProps> = ({
  barangays,
  onSelectCommunity,
}) => {
  const topCommunities = [...barangays]
    .sort((a, b) => b.cases - a.cases)
    .slice(0, 3);

  const getRiskBadge = (label: string) => {
    switch (label) {
      case 'VERY HIGH':
      case 'HIGH':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'MODERATE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="immersive-card rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">📍 Highest Risk Communities</h2>
            <p className="text-xs text-slate-400">
              Top priority zones ranked by forecasted case volume and epidemiological risk index
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {topCommunities.map((b) => (
          <div
            key={b.id}
            onClick={() => onSelectCommunity?.(b)}
            className="group bg-white/[0.02] border border-white/10 hover:border-indigo-500/40 rounded-2xl p-5 transition-all duration-200 hover:bg-white/[0.04] cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="line-clamp-1">{b.name}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getRiskBadge(
                    b.riskLabel
                  )}`}
                >
                  {b.riskLabel}
                </span>
              </div>

              <div className="my-4">
                <div className="text-4xl font-extrabold text-white tracking-tight">
                  {b.cases}
                </div>
                <p className="text-xs text-slate-400 mt-1">Projected Cases ({b.total} historical)</p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Positivity: <strong className="text-amber-400">{b.rate}%</strong></span>
              <span className="flex items-center gap-1 text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                Explore <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
