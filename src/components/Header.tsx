import React from 'react';
import { Activity, ShieldAlert, Sparkles, MapPin } from 'lucide-react';

interface HeaderProps {
  onOpenChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenChat }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/10 text-white shadow-2xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-indigo-500/30 border border-white/20 shrink-0">
              T
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span>TPHIS</span>
                  <span className="text-indigo-400 font-normal">CORE</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  v2.4 Active
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                Koronadal City Health Intelligence • Real-time Disease Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>92% Operational</span>
            </div>

            <button
              onClick={onOpenChat}
              className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 border border-white/10 transition-all duration-200 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 group-hover:rotate-12 transition-transform" />
              <span>Gemini AI Assistant</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-300"></span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
