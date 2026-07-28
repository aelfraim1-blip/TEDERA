import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BarangayComputed } from '../types';
import { heatColor } from '../data/tphisData';
import { Map, Layers } from 'lucide-react';

interface GpsRiskMapProps {
  barangays: BarangayComputed[];
  years: number;
  onAskAIAboutMap?: (barangayName: string) => void;
}

export const GpsRiskMap: React.FC<GpsRiskMapProps> = ({
  barangays,
  years,
  onAskAIAboutMap,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
      }).setView([6.4975, 124.842], 13.2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      layerGroupRef.current = layerGroup;
    }

    const layerGroup = layerGroupRef.current;
    if (!layerGroup) return;

    layerGroup.clearLayers();

    const maxCases = Math.max(...barangays.map((b) => b.cases), 1);

    barangays.forEach((b) => {
      const radius = 12 + (b.cases / maxCases) * 20;
      const fillColor = heatColor(b.riskScore);

      const marker = L.circleMarker([b.lat, b.lng], {
        radius,
        fillColor,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85,
      });

      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; color: #1e293b; min-width: 200px; padding: 4px;">
          <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #0f172a;">
            📍 ${b.name}
          </h4>
          <div style="font-size: 12px; line-height: 1.5; color: #334155;">
            <p style="margin: 3px 0;"><strong>Risk Index:</strong> ${b.riskScore}/100 (${b.riskLabel})</p>
            <p style="margin: 3px 0;"><strong>Projected Cases (${years * 12}m):</strong> ${b.cases}</p>
            <p style="margin: 3px 0;"><strong>Positivity Rate:</strong> ${b.rate}%</p>
            <p style="margin: 3px 0;"><strong>Historical Baseline:</strong> ${b.total} cases</p>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.addTo(layerGroup);
    });
  }, [barangays, years]);

  return (
    <div className="immersive-card rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">🗺️ GPS Risk Map — Koronadal City</h2>
            <p className="text-xs text-slate-400">
              Interactive geographic markers showing risk levels (color) and projected case volume (radius size)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Interactive OpenStreetMap Engine</span>
        </div>
      </div>

      <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-white/10 shadow-inner z-0">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      <p className="text-xs text-slate-400 mt-3 text-center">
        💡 Click or tap any barangay marker on the map to inspect localized epidemiological metrics.
      </p>
    </div>
  );
};
