import React from 'react';
import { Gauge, Zap, Flame, Shield, ArrowUpRight } from 'lucide-react';
import { DriveMode, GearState } from '../types';

interface SpeedometerProps {
  speed: number;
  rpm: number;
  maxSpeed?: number;
  driveMode: DriveMode;
  gear: GearState;
  throttlePercent: number;
  powerKw: number;
  onSelectDriveMode: (mode: DriveMode) => void;
  onSelectGear: (gear: GearState) => void;
}

export const Speedometer: React.FC<SpeedometerProps> = ({
  speed,
  rpm,
  maxSpeed = 120,
  driveMode,
  gear,
  throttlePercent,
  powerKw,
  onSelectDriveMode,
  onSelectGear,
}) => {
  // SVG gauge arc math
  const clampedSpeed = Math.min(maxSpeed, Math.max(0, speed));
  const speedPercentage = clampedSpeed / maxSpeed;
  
  // Angle range: -210 deg to 30 deg (total 240 degrees arc)
  const startAngle = -210;
  const endAngle = 30;
  const angle = startAngle + speedPercentage * (endAngle - startAngle);

  // SVG parameters
  const radius = 120;
  const cx = 150;
  const cy = 150;
  const strokeWidth = 14;

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, startA: number, endA: number) => {
    const start = polarToCartesian(x, y, r, endA);
    const end = polarToCartesian(x, y, r, startA);
    const largeArcFlag = endA - startA <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const bgPath = describeArc(cx, cy, radius, startAngle, endAngle);
  const activePath = describeArc(cx, cy, radius, startAngle, angle > startAngle + 0.1 ? angle : startAngle + 0.1);

  // Needle endpoint
  const needleAngleRad = ((angle - 90) * Math.PI) / 180;
  const needleLength = 95;
  const needleX = cx + needleLength * Math.cos(needleAngleRad);
  const needleY = cy + needleLength * Math.sin(needleAngleRad);

  const getDriveModeColor = (mode: DriveMode) => {
    switch (mode) {
      case 'ECO':
        return 'text-emerald-400 border-emerald-500/50 bg-emerald-950/60 hover:bg-emerald-900';
      case 'CITY':
        return 'text-cyan-400 border-cyan-500/50 bg-cyan-950/60 hover:bg-cyan-900';
      case 'SPORT':
        return 'text-purple-400 border-purple-500/50 bg-purple-950/60 hover:bg-purple-900';
      case 'TURBO':
        return 'text-amber-400 border-amber-500/50 bg-amber-950/60 hover:bg-amber-900 animate-pulse';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col items-center justify-between">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between text-xs font-mono mb-2">
        <span className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-wider">
          <Gauge className="w-4 h-4 text-cyan-400" /> Digital Speedometer
        </span>
        <span className="text-slate-400">
          Max Governor: <strong className="text-white">{maxSpeed} KM/H</strong>
        </span>
      </div>

      {/* Speed Gauge Graphics */}
      <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center my-2">
        <svg className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.25)]" viewBox="0 0 300 300">
          <defs>
            {/* Speed Gradient */}
            <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="85%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Outer Ring */}
          <circle cx={cx} cy={cy} r="138" fill="none" stroke="#0f172a" strokeWidth="6" />

          {/* Background Arc */}
          <path
            d={bgPath}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Ticks */}
          {[0, 20, 40, 60, 80, 100, 120].map((val) => {
            const valPct = val / maxSpeed;
            const valAngle = startAngle + valPct * (endAngle - startAngle);
            const innerP = polarToCartesian(cx, cy, radius - 18, valAngle);
            const outerP = polarToCartesian(cx, cy, radius - 8, valAngle);
            const textP = polarToCartesian(cx, cy, radius - 30, valAngle);
            return (
              <g key={val}>
                <line
                  x1={innerP.x}
                  y1={innerP.y}
                  x2={outerP.x}
                  y2={outerP.y}
                  stroke={val > 100 ? '#f43f5e' : '#64748b'}
                  strokeWidth="2.5"
                />
                <text
                  x={textP.x}
                  y={textP.y}
                  fill={val === speed ? '#38bdf8' : '#94a3b8'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Active Progress Arc */}
          <path
            d={activePath}
            fill="none"
            stroke="url(#speedGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Needle Line */}
          <line
            x1={cx}
            y1={cy}
            x2={needleX}
            y2={needleY}
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-150 ease-out"
          />

          {/* Center Hub */}
          <circle cx={cx} cy={cy} r="18" fill="#090d16" stroke="#06b6d4" strokeWidth="3" />
          <circle cx={cx} cy={cy} r="6" fill="#38bdf8" />
        </svg>

        {/* Center Digital Speed Readout */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none mt-6">
          <div className="text-5xl font-black font-mono tracking-tighter text-white drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
            {Math.round(speed)}
          </div>
          <div className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase mt-0.5">
            KM / H
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-1">
            <span>{Math.round(rpm)}</span> <span className="text-slate-500">RPM</span>
          </div>
        </div>
      </div>

      {/* Throttle & Power Output Indicator Bar */}
      <div className="w-full grid grid-cols-2 gap-2 my-2">
        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Throttle</span>
            <span className="text-cyan-400 font-bold">{Math.round(throttlePercent)}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-150"
              style={{ width: `${throttlePercent}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Motor Draw</span>
            <span className="text-emerald-400 font-bold">{powerKw.toFixed(1)} kW</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-150"
              style={{ width: `${Math.min(100, (powerKw / 15) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Gear Selector Buttons */}
      <div className="w-full flex items-center justify-center gap-2 my-2">
        {(['P', 'R', 'N', 'D'] as GearState[]).map((g) => (
          <button
            key={g}
            onClick={() => onSelectGear(g)}
            className={`w-11 h-10 rounded-xl font-mono font-black text-sm transition-all border flex items-center justify-center ${
              gear === g
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30 scale-105'
                : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-slate-800'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Drive Mode Selector Buttons */}
      <div className="w-full grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-800/80">
        {(['ECO', 'CITY', 'SPORT', 'TURBO'] as DriveMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onSelectDriveMode(mode)}
            className={`py-1.5 rounded-lg font-mono text-[11px] font-bold tracking-wider transition-all border text-center ${
              driveMode === mode
                ? getDriveModeColor(mode) + ' shadow-md scale-[1.02]'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
};
