import React from 'react';
import { BarangayComputed } from '../types';
import { Brain, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface SmartInsightsProps {
  topBarangay: BarangayComputed;
  secondBarangay?: BarangayComputed;
  overallPositivityRate: number;
  overallTotal: number;
  years: number;
  onAskAIDeepDive?: (topic: string) => void;
}

export const SmartInsights: React.FC<SmartInsightsProps> = ({
  topBarangay,
  secondBarangay,
  overallPositivityRate,
  overallTotal,
  years,
  onAskAIDeepDive,
}) => {
  const growthCases = topBarangay.cases - topBarangay.total;
  const growthPct = Math.round((growthCases / topBarangay.total) * 100);
  const burdenShare = Math.round((topBarangay.total / overallTotal) * 100);

  const severityNarrative =
    topBarangay.riskLabel === 'VERY HIGH' || topBarangay.riskLabel === 'HIGH'
      ? `With a positivity rate of ${topBarangay.rate}% against a citywide average of ${overallPositivityRate}%, this barangay is running well above baseline transmission — a strong signal of an active exposure source (unprotected water point, open drainage/septic overflow, or stagnant flooding zone) rather than sporadic isolated cases.`
      : `Its positivity rate of ${topBarangay.rate}% sits closer to the citywide baseline of ${overallPositivityRate}%, suggesting the rank is driven primarily by population density and baseline case volume.`;

  return (
    <div className="immersive-card rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">🤖 Smart Epidemiological Insights</h2>
            <p className="text-xs text-slate-400">
              Automated root-cause analysis and strategic intervention logic
            </p>
          </div>
        </div>

        {onAskAIDeepDive && (
          <button
            onClick={() => onAskAIDeepDive(`Explain root cause analysis for ${topBarangay.name}`)}
            className="px-3.5 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span>Ask Gemini for Deep Dive</span>
          </button>
        )}
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {/* Root Cause Section */}
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            Root Cause Analysis — <span className="text-purple-400">{topBarangay.name}</span>
          </h3>
          <p className="mb-3">
            {severityNarrative} {topBarangay.name} currently accounts for roughly{' '}
            <strong className="text-white">{burdenShare}%</strong> of Koronadal City's total recorded case load, scoring{' '}
            <strong className="text-purple-400">{topBarangay.riskScore}/100</strong> on the composite index.
          </p>

          <p className="font-semibold text-white mb-2">Likely Contributing Factors (Ranked by Impact):</p>
          <ol className="list-decimal list-inside space-y-1.5 pl-2 text-slate-300">
            <li>
              <strong className="text-white">Water Source Contamination:</strong> Untreated communal wells or compromised distribution pipes.
            </li>
            <li>
              <strong className="text-white">Sanitation & Waste Gaps:</strong> Unsealed septic tanks, open drainage canals, or poor solid waste collection.
            </li>
            <li>
              <strong className="text-white">Hygiene Barriers:</strong> Inadequate handwashing stations in public markets or dense neighborhood clusters.
            </li>
            <li>
              <strong className="text-white">Environmental/Flooding Exposure:</strong> Seasonal rainwater pooling or stagnant vector breeding grounds.
            </li>
            <li>
              <strong className="text-white">Household Density:</strong> High occupancy per housing unit accelerating intra-family secondary transmission.
            </li>
          </ol>
        </div>

        {/* Growth Forecast Explanation */}
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Growth Projection Logic ({years * 12} Months)
          </h3>
          <p className="mb-2">
            Under the selected forecast window, cases in {topBarangay.name} are projected to expand from{' '}
            <strong className="text-white">{topBarangay.total}</strong> to <strong className="text-rose-400">{topBarangay.cases}</strong> (+{growthCases} cases, ~{growthPct}% expansion).
          </p>
          <p className="text-slate-400">
            <em>Note:</em> The projection assumes current environmental baseline conditions persist without active targeted health interventions. Bending this curve requires early point-source remediation.
          </p>

          {secondBarangay && (
            <p className="mt-3 pt-3 border-t border-white/10 text-slate-300">
              For comparison, the second highest-risk zone, <strong className="text-white">{secondBarangay.name}</strong>, scores <strong className="text-amber-400">{secondBarangay.riskScore}/100</strong> with {secondBarangay.cases} forecasted cases.
            </p>
          )}
        </div>

        {/* Action Timeline */}
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Recommended Response Timeline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/40 p-3.5 rounded-xl border border-white/10">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">Immediate (0–30 Days)</div>
              <p className="text-xs text-slate-300">
                Water quality sampling at public taps; distribution of water purification tablets and oral rehydration supplies; active case-finding.
              </p>
            </div>

            <div className="bg-black/40 p-3.5 rounded-xl border border-white/10">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Short-Term (1–6 Months)</div>
              <p className="text-xs text-slate-300">
                Repair compromised drainage; install handwashing stations at schools and health posts; community sanitation drives.
              </p>
            </div>

            <div className="bg-black/40 p-3.5 rounded-xl border border-white/10">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Long-Term (6+ Months)</div>
              <p className="text-xs text-slate-300">
                Permanent centralized water infrastructure upgrades; continuous epidemiological GIS monitoring; septic tank desludging policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
