import React from 'react';
import { Flame, Fan, Thermometer, ShieldAlert, Cpu } from 'lucide-react';

interface MotorTempCardProps {
  motorTemp: number;
  controllerTemp: number;
  batteryTemp: number;
  ambientTemp: number;
}

export const MotorTempCard: React.FC<MotorTempCardProps> = ({
  motorTemp,
  controllerTemp,
  batteryTemp,
  ambientTemp,
}) => {
  const getTempColor = (temp: number) => {
    if (temp >= 80) return 'text-red-400 bg-red-950/80 border-red-700/80';
    if (temp >= 65) return 'text-amber-400 bg-amber-950/80 border-amber-700/80';
    return 'text-cyan-400 bg-cyan-950/80 border-cyan-800/80';
  };

  const getThermalStatusText = (temp: number) => {
    if (temp >= 80) return 'CRITICAL OVERHEAT';
    if (temp >= 65) return 'ELEVATED WARMTH';
    return 'OPTIMAL OPERATING TEMP';
  };

  const fanSpeedPercent = Math.min(100, Math.max(20, Math.round((motorTemp / 85) * 100)));

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-mono mb-2">
        <span className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-wider">
          <Thermometer className="w-4 h-4 text-cyan-400" /> Powertrain Thermal Monitoring
        </span>
        <span
          className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${getTempColor(
            motorTemp
          )}`}
        >
          {getThermalStatusText(motorTemp)}
        </span>
      </div>

      {/* Main Temp Meters */}
      <div className="grid grid-cols-2 gap-3 my-2">
        {/* Motor Temperature */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Motor Temp
            </span>
            <span className="text-[10px] text-slate-500">BLDC 3-Phase</span>
          </div>

          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-3xl font-black font-mono ${
                motorTemp > 75 ? 'text-red-400' : motorTemp > 60 ? 'text-amber-400' : 'text-white'
              }`}
            >
              {motorTemp}
            </span>
            <span className="text-sm font-bold font-mono text-slate-400">°C</span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                motorTemp > 75 ? 'bg-red-500' : motorTemp > 60 ? 'bg-amber-400' : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(100, (motorTemp / 110) * 100)}%` }}
            />
          </div>
        </div>

        {/* Controller / Inverter Temperature */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Controller MCU
            </span>
            <span className="text-[10px] text-slate-500">FOC Inverter</span>
          </div>

          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-3xl font-black font-mono ${
                controllerTemp > 75
                  ? 'text-red-400'
                  : controllerTemp > 60
                  ? 'text-amber-400'
                  : 'text-white'
              }`}
            >
              {controllerTemp}
            </span>
            <span className="text-sm font-bold font-mono text-slate-400">°C</span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                controllerTemp > 75
                  ? 'bg-red-500'
                  : controllerTemp > 60
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, (controllerTemp / 100) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Auxiliary Thermal Metrics & Fan Control */}
      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/80">
        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60 text-center">
          <span className="text-[10px] text-slate-400 font-mono block">Battery Pack</span>
          <span className="text-xs font-bold font-mono text-emerald-400">{batteryTemp}°C</span>
        </div>

        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60 text-center">
          <span className="text-[10px] text-slate-400 font-mono block">Ambient Ambient</span>
          <span className="text-xs font-bold font-mono text-slate-200">{ambientTemp}°C</span>
        </div>

        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60 flex items-center justify-center gap-1.5">
          <Fan
            className={`w-4 h-4 text-cyan-400 ${
              fanSpeedPercent > 30 ? 'animate-spin' : ''
            }`}
          />
          <div className="text-left">
            <span className="text-[9px] text-slate-400 font-mono block">Fan Speed</span>
            <span className="text-xs font-bold font-mono text-cyan-300">{fanSpeedPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
