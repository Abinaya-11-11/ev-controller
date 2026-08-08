import React from 'react';
import {
  Zap,
  Cpu,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Activity,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { VehicleState } from '../types';

interface HeaderProps {
  vehicleState: VehicleState;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onResetTrip: () => void;
  onToggleKillSwitch: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  vehicleState,
  isSimulating,
  onToggleSimulation,
  onResetTrip,
  onToggleKillSwitch,
  activeTab,
}) => {
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3 text-slate-100 flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-black/20">
      {/* Brand & Subsystem Title */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-md shadow-cyan-500/20 text-slate-950 font-bold">
          <Zap className="w-6 h-6 stroke-[2.5]" />
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-extrabold tracking-wide text-white uppercase font-mono">
              NEXUS EV-Controller <span className="text-cyan-400">v2.4</span>
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
              AI & DS Project
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            CAN Bus: <span className="text-emerald-400 font-semibold">ONLINE (500 kbps)</span>
            <span className="mx-1">•</span>
            MCU Temp: <span className="text-slate-300">{vehicleState.controllerTemp}°C</span>
          </p>
        </div>
      </div>

      {/* Center Status Badges */}
      <div className="hidden lg:flex items-center gap-3 bg-slate-950/60 p-1.5 px-3 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-mono">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-slate-400">Mode:</span>
          <span className="font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/60">
            {vehicleState.driveMode}
          </span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Gear:</span>
          <span
            className={`font-black text-sm px-2 py-0.5 rounded ${
              vehicleState.gear === 'D'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60'
                : vehicleState.gear === 'R'
                ? 'bg-amber-950 text-amber-400 border border-amber-700/60'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {vehicleState.gear}
          </span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Ride Time:</span>
          <span className="font-semibold text-emerald-400">
            {formatTime(vehicleState.rideTimeSeconds)}
          </span>
        </div>
      </div>

      {/* Right Controls & Emergency Actions */}
      <div className="flex items-center gap-2">
        {/* Simulation Play/Pause Toggle */}
        <button
          onClick={onToggleSimulation}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all border shadow-sm ${
            isSimulating
              ? 'bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border-emerald-700/60'
              : 'bg-amber-950/80 hover:bg-amber-900/90 text-amber-300 border-amber-700/60'
          }`}
          title="Toggle live telemetry simulation loop"
        >
          {isSimulating ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>PAUSE TELEMETRY</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>RESUME TELEMETRY</span>
            </>
          )}
        </button>

        {/* Reset Trip Button */}
        <button
          onClick={onResetTrip}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
          title="Reset Trip Distance & Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Emergency Kill Switch */}
        <button
          onClick={onToggleKillSwitch}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-md ${
            vehicleState.killSwitchActive
              ? 'bg-red-600 text-white border-red-500 animate-bounce'
              : 'bg-red-950/80 hover:bg-red-900 text-red-300 border-red-800/80'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span>{vehicleState.killSwitchActive ? 'KILL SWITCH ACTIVE' : 'EMERGENCY STOP'}</span>
        </button>
      </div>
    </header>
  );
};
