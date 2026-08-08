import React from 'react';
import { Route, Clock, Zap, Gauge, Compass, Award } from 'lucide-react';

interface QuickStatsCardProps {
  tripDistanceKm: number;
  totalOdometerKm: number;
  rideTimeSeconds: number;
  energyEfficiencyWhKm: number;
  avgSpeedKmH: number;
}

export const QuickStatsCard: React.FC<QuickStatsCardProps> = ({
  tripDistanceKm,
  totalOdometerKm,
  rideTimeSeconds,
  energyEfficiencyWhKm,
  avgSpeedKmH,
}) => {
  const formatRideTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Trip Distance */}
      <div className="bg-slate-900/90 border border-slate-800/90 p-3.5 rounded-2xl shadow-md flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60 shrink-0">
          <Route className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Trip Distance
          </div>
          <div className="text-xl font-extrabold font-mono text-white mt-0.5">
            {tripDistanceKm.toFixed(1)}{' '}
            <span className="text-xs text-slate-400 font-normal">KM</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Odo: {totalOdometerKm.toLocaleString()} KM
          </div>
        </div>
      </div>

      {/* Ride Time */}
      <div className="bg-slate-900/90 border border-slate-800/90 p-3.5 rounded-2xl shadow-md flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/60 shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Current Ride Time
          </div>
          <div className="text-xl font-extrabold font-mono text-emerald-400 mt-0.5">
            {formatRideTime(rideTimeSeconds)}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Continuous Logging</div>
        </div>
      </div>

      {/* Energy Efficiency */}
      <div className="bg-slate-900/90 border border-slate-800/90 p-3.5 rounded-2xl shadow-md flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-purple-950 text-purple-400 border border-purple-800/60 shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Efficiency
          </div>
          <div className="text-xl font-extrabold font-mono text-purple-300 mt-0.5">
            {energyEfficiencyWhKm.toFixed(0)}{' '}
            <span className="text-xs text-slate-400 font-normal">Wh/km</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono font-semibold">
            ✦ Eco Score: 94%
          </div>
        </div>
      </div>

      {/* Average Speed */}
      <div className="bg-slate-900/90 border border-slate-800/90 p-3.5 rounded-2xl shadow-md flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/60 shrink-0">
          <Gauge className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Avg Speed
          </div>
          <div className="text-xl font-extrabold font-mono text-amber-300 mt-0.5">
            {avgSpeedKmH.toFixed(1)}{' '}
            <span className="text-xs text-slate-400 font-normal">KM/H</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">City Standard</div>
        </div>
      </div>
    </div>
  );
};
