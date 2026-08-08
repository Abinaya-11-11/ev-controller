import React, { useState } from 'react';
import {
  Battery,
  BatteryCharging,
  Zap,
  Activity,
  Layers,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface BatteryGaugeProps {
  batteryPercent: number;
  batteryVoltage: number;
  batteryCurrent: number;
  batteryPowerKw: number;
  estimatedRangeKm: number;
  isCharging: boolean;
  chargerType: string;
  stateOfHealth: number;
  cellBalancing: number[];
}

export const BatteryGauge: React.FC<BatteryGaugeProps> = ({
  batteryPercent,
  batteryVoltage,
  batteryCurrent,
  batteryPowerKw,
  estimatedRangeKm,
  isCharging,
  chargerType,
  stateOfHealth,
  cellBalancing,
}) => {
  const [showCells, setShowCells] = useState(false);

  // Power flow state
  const isDischarging = batteryCurrent > 0;
  const isRegen = batteryCurrent < 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between text-xs font-mono mb-3">
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider">
          {isCharging ? (
            <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
          ) : (
            <Battery className="w-4 h-4 text-emerald-400" />
          )}
          Battery Management System (BMS)
        </span>
        <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-bold text-[10px]">
          72V 60Ah LiFePO4
        </span>
      </div>

      {/* Main Battery SoC and Estimated Range Block */}
      <div className="grid grid-cols-2 gap-4 items-center my-1">
        {/* Big SoC Percentage */}
        <div className="flex flex-col">
          <span className="text-slate-400 text-xs font-mono uppercase">State of Charge (SoC)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={`text-5xl font-black font-mono ${
                batteryPercent < 20
                  ? 'text-red-400'
                  : batteryPercent < 40
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {batteryPercent}%
            </span>
            {isCharging && (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 animate-pulse">
                ⚡ CHARGING ({chargerType})
              </span>
            )}
          </div>

          {/* Battery Level Segment Bar */}
          <div className="w-full bg-slate-950 h-3.5 rounded-lg p-0.5 border border-slate-800 mt-2 flex gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => {
              const segThreshold = (i + 1) * 10;
              const isFilled = batteryPercent >= segThreshold - 5;
              return (
                <div
                  key={i}
                  className={`h-full flex-1 rounded-sm transition-all ${
                    isFilled
                      ? batteryPercent < 20
                        ? 'bg-red-500'
                        : batteryPercent < 40
                        ? 'bg-amber-400'
                        : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                      : 'bg-slate-800/60'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Estimated Range Card */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Est. Range</span>
            <span className="text-[10px] text-cyan-400 font-bold">AI PREDICTED</span>
          </div>
          <div className="my-1">
            <span className="text-3xl font-extrabold font-mono text-white">
              {estimatedRangeKm}
            </span>
            <span className="text-xs text-slate-400 font-mono ml-1.5 font-bold">KM</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            Based on current speed & power draw
          </p>
        </div>
      </div>

      {/* Electrical Telemetry Grid */}
      <div className="grid grid-cols-3 gap-2 my-3">
        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <div className="text-[10px] font-mono text-slate-400">Pack Voltage</div>
          <div className="text-sm font-bold font-mono text-slate-100 mt-0.5">
            {batteryVoltage.toFixed(1)} <span className="text-xs text-slate-400 font-normal">V</span>
          </div>
        </div>

        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <div className="text-[10px] font-mono text-slate-400">Pack Current</div>
          <div
            className={`text-sm font-bold font-mono mt-0.5 ${
              isRegen ? 'text-emerald-400' : 'text-cyan-300'
            }`}
          >
            {batteryCurrent.toFixed(1)} <span className="text-xs text-slate-400 font-normal">A</span>
          </div>
        </div>

        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <div className="text-[10px] font-mono text-slate-400">Health (SoH)</div>
          <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
            {stateOfHealth}%
          </div>
        </div>
      </div>

      {/* 20S Cell Voltage Balance Drawer Toggle */}
      <div className="mt-1 pt-2 border-t border-slate-800/80">
        <button
          onClick={() => setShowCells(!showCells)}
          className="w-full flex items-center justify-between text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Cell Balancer (20S Lithium Pack)</span>
          </span>
          {showCells ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showCells && (
          <div className="mt-3 bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>Cell Delta Max: <strong className="text-emerald-400">12 mV (OK)</strong></span>
              <span>Avg: 3.61 V</span>
            </div>
            <div className="grid grid-cols-10 gap-1">
              {cellBalancing.map((voltage, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-slate-900 p-1 rounded border border-slate-800"
                  title={`Cell #${idx + 1}: ${voltage.toFixed(3)}V`}
                >
                  <span className="text-[9px] font-mono text-slate-500">#{idx + 1}</span>
                  <div className="w-full bg-slate-800 h-6 rounded-sm overflow-hidden flex items-end my-0.5">
                    <div
                      className="w-full bg-emerald-400 rounded-sm"
                      style={{ height: `${Math.min(100, ((voltage - 3.0) / 0.8) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[8px] font-mono text-slate-300">{voltage.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
