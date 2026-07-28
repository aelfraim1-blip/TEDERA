import React from 'react';
import { BarangayComputed } from '../types';
import { AlertTriangle, MapPin, Sparkles } from 'lucide-react';

interface CommunityAlertProps {
  topBarangay: BarangayComputed;
  onAskAIAboutAlert?: () => void;
}

export const CommunityAlert: React.FC<CommunityAlertProps> = ({
  topBarangay,
  onAskAIAboutAlert,
}) => {
  return (
    <div className="bg-gradient-to-br from-rose-950/40 via-purple-950/20 to-black/60 border border-rose-500/30 rounded-2xl p-6 shadow-xl mb-8 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="p-2.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl animate-pulse">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🚨 Community Priority Alert
          </h2>
          <p className="text-xs text-rose-300">
            Highest Risk Designation — Immediate Public Health Priority Zone
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-white mb-1">
            <MapPin className="w-5 h-5 text-rose-400" />
            <span>{topBarangay.name}</span>
          </div>

          <div className="flex items-center gap-3 my-3">
            <span className="px-3 py-1 bg-rose-500/30 text-rose-200 border border-rose-500/40 font-black text-xs rounded-full uppercase tracking-wider">
              {topBarangay.riskLabel} RISK ({topBarangay.riskScore}/100)
            </span>
            <span className="text-slate-300 text-sm font-semibold">
              <strong className="text-white font-extrabold">{topBarangay.cases}</strong> Projected Cases
            </span>
          </div>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            This community exhibits the highest projected disease burden in Koronadal City when combining historical cases, forecasted growth, high positivity rate ({topBarangay.rate}%), and localized population density.
          </p>
        </div>

        {onAskAIAboutAlert && (
          <button
            onClick={onAskAIAboutAlert}
            className="self-start md:self-auto px-5 py-3 bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 border border-white/10 flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Ask Gemini AI for Action Plan</span>
          </button>
        )}
      </div>
    </div>
  );
};
