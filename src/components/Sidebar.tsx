import React from 'react';
import {
  Gauge,
  History,
  BrainCircuit,
  Sliders,
  Settings,
  Shield,
  Zap,
  Battery,
  Wrench,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'history' | 'ai-diagnostics' | 'simulation';
  setActiveTab: (tab: 'dashboard' | 'history' | 'ai-diagnostics' | 'simulation') => void;
  batteryPercent: number;
  isCharging: boolean;
  motorTemp: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  batteryPercent,
  isCharging,
  motorTemp,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Home Dashboard',
      subtitle: 'Speed, Battery, Telemetry',
      icon: Gauge,
      badge: 'LIVE',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
    {
      id: 'history',
      label: 'History & Analytics',
      subtitle: 'Rides, Battery SoH, Service',
      icon: History,
      badge: '4 Logs',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'ai-diagnostics',
      label: 'AI & Controller Tech',
      subtitle: 'Range Predictor, CAN Bus',
      icon: BrainCircuit,
      badge: 'AI v2',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    {
      id: 'simulation',
      label: 'Testing Simulator',
      subtitle: 'Throttle, Slope & Faults',
      icon: Sliders,
      badge: 'Interactive',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
  ] as const;

  return (
    <aside className="w-full md:w-64 bg-slate-900/95 border-r border-slate-800/80 flex flex-col justify-between p-3 shrink-0">
      {/* Top Navigation Links */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>NAVIGATION</span>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-500/50 text-white shadow-lg shadow-cyan-950/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r shadow-glow" />
              )}
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800/80 text-slate-400 group-hover:text-cyan-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight">{item.label}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{item.subtitle}</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Controller Hardware Status Box */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-3">
        <div className="px-2 text-[11px] font-mono text-slate-400 uppercase tracking-wide flex items-center justify-between">
          <span>MCU Telemetry</span>
          <span className="text-emerald-400 font-bold">HEALTHY</span>
        </div>

        {/* Battery Quick Bar */}
        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-emerald-400" /> SoC
            </span>
            <span
              className={`font-bold ${
                batteryPercent < 20
                  ? 'text-red-400'
                  : batteryPercent < 40
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {batteryPercent}% {isCharging && '⚡'}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                batteryPercent < 20
                  ? 'bg-red-500'
                  : batteryPercent < 40
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${batteryPercent}%` }}
            />
          </div>
        </div>

        {/* Thermal Bar */}
        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Motor Temp
            </span>
            <span
              className={`font-bold ${
                motorTemp > 75 ? 'text-red-400' : motorTemp > 60 ? 'text-amber-400' : 'text-cyan-400'
              }`}
            >
              {motorTemp}°C
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                motorTemp > 75 ? 'bg-red-500' : motorTemp > 60 ? 'bg-amber-400' : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(100, (motorTemp / 100) * 100)}%` }}
            />
          </div>
        </div>

        {/* Footer Credit for Project */}
        <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/40 text-center">
          <p className="text-[11px] text-slate-400 font-mono">
            Project by <span className="text-cyan-400 font-semibold">2nd Yr AI & DS</span>
          </p>
          <p className="text-[10px] text-slate-500">Autonomous & Smart EV Lab</p>
        </div>
      </div>
    </aside>
  );
};
