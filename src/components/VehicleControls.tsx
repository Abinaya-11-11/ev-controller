import React from 'react';
import {
  Lightbulb,
  SunMedium,
  Sparkles,
  AlertOctagon,
  Disc,
  Power,
  Shield,
  Zap,
  Radio,
  ArrowLeft,
  ArrowRight,
  Sun,
  Eye,
} from 'lucide-react';
import { VehicleState, RegenLevel } from '../types';

interface VehicleControlsProps {
  lights: VehicleState['lights'];
  regenLevel: RegenLevel;
  brakeApplied: boolean;
  absActive: boolean;
  onToggleLight: (lightKey: keyof VehicleState['lights']) => void;
  onSetRegenLevel: (level: RegenLevel) => void;
  onToggleBrake: () => void;
}

export const VehicleControls: React.FC<VehicleControlsProps> = ({
  lights,
  regenLevel,
  brakeApplied,
  absActive,
  onToggleLight,
  onSetRegenLevel,
  onToggleBrake,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800/80 pb-2">
        <span className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-wider">
          <Shield className="w-4 h-4 text-cyan-400" /> Vehicle Actuators & Lighting
        </span>
        <span className="text-slate-400">GPIO PWM Switch Bank</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Light Controls Section */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Lighting Array</span>
            <span className="text-[10px] text-cyan-400 font-mono">12V Converter Bus</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Headlight */}
            <button
              onClick={() => onToggleLight('headlights')}
              className={`p-2.5 rounded-xl border font-mono text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                lights.headlights
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/80 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Lightbulb className={`w-4 h-4 ${lights.headlights ? 'text-cyan-400' : ''}`} />
              <span>Headlight</span>
            </button>

            {/* High Beam */}
            <button
              onClick={() => onToggleLight('highBeam')}
              className={`p-2.5 rounded-xl border font-mono text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                lights.highBeam
                  ? 'bg-blue-950 text-blue-300 border-blue-500/80 shadow-md shadow-blue-500/20'
                  : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <SunMedium className={`w-4 h-4 ${lights.highBeam ? 'text-blue-400' : ''}`} />
              <span>High Beam</span>
            </button>

            {/* Hazard Flasher */}
            <button
              onClick={() => onToggleLight('hazard')}
              className={`p-2.5 rounded-xl border font-mono text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                lights.hazard
                  ? 'bg-amber-950 text-amber-300 border-amber-500/80 animate-pulse shadow-md'
                  : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <AlertOctagon className={`w-4 h-4 ${lights.hazard ? 'text-amber-400' : ''}`} />
              <span>Hazard</span>
            </button>

            {/* Left Indicator */}
            <button
              onClick={() => onToggleLight('indicatorLeft')}
              className={`p-2 rounded-xl border font-mono text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                lights.indicatorLeft
                  ? 'bg-amber-950 text-amber-300 border-amber-500/80 animate-pulse'
                  : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Left Blinker</span>
            </button>

            {/* Right Indicator */}
            <button
              onClick={() => onToggleLight('indicatorRight')}
              className={`p-2 rounded-xl border font-mono text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                lights.indicatorRight
                  ? 'bg-amber-950 text-amber-300 border-amber-500/80 animate-pulse'
                  : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span>Right Blinker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Neon Underglow */}
            <button
              onClick={() => onToggleLight('underglow')}
              className={`p-2 rounded-xl border font-mono text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                lights.underglow
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/80 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Underglow</span>
            </button>
          </div>
        </div>

        {/* Brake & Regenerative Control Section */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Brake & Energy Recovery (Regen)</span>
            <span className="text-[10px] text-emerald-400 font-mono">
              ABS: {absActive ? 'ENGAGED' : 'READY'}
            </span>
          </div>

          {/* Regen Level Buttons */}
          <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['OFF', 'LOW', 'MEDIUM', 'HIGH'] as RegenLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => onSetRegenLevel(level)}
                className={`py-1.5 rounded-lg font-mono text-[11px] font-bold transition-all border ${
                  regenLevel === level
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Manual Brake Actuation Button */}
          <button
            onClick={onToggleBrake}
            className={`w-full py-3 rounded-xl font-mono text-xs font-extrabold flex items-center justify-center gap-2 transition-all border ${
              brakeApplied
                ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-600/40 animate-pulse'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border-slate-800'
            }`}
          >
            <Disc className={`w-4 h-4 ${brakeApplied ? 'animate-spin' : ''}`} />
            <span>
              {brakeApplied ? '🛑 BRAKE ENGAGED (REGEN ACTIVE)' : 'APPLY HYDRAULIC BRAKE'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
