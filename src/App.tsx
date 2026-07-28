import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { HistoricalProfile } from './components/HistoricalProfile';
import { CaseProjection } from './components/CaseProjection';
import { RiskCommunities } from './components/RiskCommunities';
import { HeatMapIndex } from './components/HeatMapIndex';
import { GpsRiskMap } from './components/GpsRiskMap';
import { CommunityAlert } from './components/CommunityAlert';
import { SmartInsights } from './components/SmartInsights';
import { Recommendations } from './components/Recommendations';
import { ChatbotPanel } from './components/ChatbotPanel';

import {
  INITIAL_BARANGAYS,
  HISTORICAL_TOTAL,
  HISTORICAL_RATE,
  computeAllBarangays,
  projectCases,
} from './data/tphisData';
import { HealthDataContext, BarangayComputed } from './types';

export default function App() {
  const [years, setYears] = useState<number>(1);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);

  // Compute live barangays based on selected time horizon
  const computedBarangays = useMemo(() => {
    return computeAllBarangays(INITIAL_BARANGAYS, years);
  }, [years]);

  const topRiskBarangay = useMemo(() => {
    return [...computedBarangays].sort((a, b) => b.riskScore - a.riskScore)[0];
  }, [computedBarangays]);

  const secondRiskBarangay = useMemo(() => {
    return [...computedBarangays].sort((a, b) => b.riskScore - a.riskScore)[1];
  }, [computedBarangays]);

  // Health context payload for Gemini
  const healthContext: HealthDataContext = useMemo(() => {
    const projTotal = projectCases(HISTORICAL_TOTAL, years);
    const projPos = Math.round(projTotal * (HISTORICAL_RATE / 100));
    const projNeg = projTotal - projPos;

    return {
      totalHistoricalCases: HISTORICAL_TOTAL,
      overallPositivityRate: HISTORICAL_RATE,
      projectionYears: years,
      projectionMonths: years * 12,
      projectedTotalCases: projTotal,
      projectedPositiveCases: projPos,
      projectedNegativeCases: projNeg,
      topRiskBarangay,
      secondRiskBarangay,
      barangays: computedBarangays,
    };
  }, [years, computedBarangays, topRiskBarangay, secondRiskBarangay]);

  const triggerChatWithPrompt = (promptText: string) => {
    setChatInitialPrompt(promptText);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Radial Glow Effects */}
      <div className="immersive-glow-bg" />

      {/* App Header */}
      <Header onOpenChat={() => setIsChatOpen(true)} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Baseline Profile */}
        <HistoricalProfile />

        {/* Case Projection Controls & Display */}
        <CaseProjection
          years={years}
          onSelectYears={setYears}
          onAskAIAboutProjection={() =>
            triggerChatWithPrompt(
              `Please provide a detailed breakdown and public health impact for the ${years * 12}-month case projection (${healthContext.projectedTotalCases} cases) in Koronadal City.`
            )
          }
        />

        {/* Highest Risk Communities Cards */}
        <RiskCommunities
          barangays={computedBarangays}
          onSelectCommunity={(b) =>
            triggerChatWithPrompt(
              `Give me an epidemiological summary for ${b.name}: Risk Index ${b.riskScore}/100, ${b.cases} projected cases, ${b.rate}% positivity rate.`
            )
          }
        />

        {/* Heat Map Index Cards */}
        <HeatMapIndex
          barangays={computedBarangays}
          onSelectCommunity={(b) =>
            triggerChatWithPrompt(
              `What specific factors contribute to ${b.name} having a Risk Index of ${b.riskScore}/100? What action steps should be taken?`
            )
          }
        />

        {/* GPS Map Koronadal City */}
        <GpsRiskMap
          barangays={computedBarangays}
          years={years}
          onAskAIAboutMap={(barangayName) =>
            triggerChatWithPrompt(`Tell me more about geographic risk factors in ${barangayName}`)
          }
        />

        {/* Alert & Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CommunityAlert
            topBarangay={topRiskBarangay}
            onAskAIAboutAlert={() =>
              triggerChatWithPrompt(
                `Create an emergency 30-day intervention plan for ${topRiskBarangay.name}, our highest risk barangay.`
              )
            }
          />

          <SmartInsights
            topBarangay={topRiskBarangay}
            secondBarangay={secondRiskBarangay}
            overallPositivityRate={HISTORICAL_RATE}
            overallTotal={HISTORICAL_TOTAL}
            years={years}
            onAskAIDeepDive={(topic) => triggerChatWithPrompt(topic)}
          />
        </div>

        {/* Recommendations */}
        <Recommendations />
      </main>

      {/* Gemini AI Assistant Chatbot */}
      <ChatbotPanel
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setChatInitialPrompt(undefined);
        }}
        onOpen={() => setIsChatOpen(true)}
        healthContext={healthContext}
        initialPrompt={chatInitialPrompt}
      />
    </div>
  );
}
