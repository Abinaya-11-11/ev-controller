import React from 'react';
import { Sliders, Zap, Flame, ShieldAlert, AlertCircle, Play, RefreshCw, Disc } from 'lucide-react';
import { VehicleState, DriveMode, GearState } from '../../types';

interface SimulationBarProps {
  vehicleState: VehicleState;
  onUpdateState: (updates: Partial<VehicleState>) => void;
  onTriggerAlert: (title: string, desc: string, type: 'WARNING' | 'CRITICAL') => void;
}

export const SimulationBar: React.FC<SimulationBarProps> = ({
  vehicleState,
  onUpdateState,
  onTriggerAlert,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-extrabold font-mono text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-amber-400" /> Interactive Vehicle Hardware Simulator
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Test controller response under various throttle, motor load, thermal stress, and braking conditions.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-mono text-xs font-bold">
          Hardware-in-the-Loop (HIL)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Throttle & Speed Control Sliders */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
          <span className="font-mono font-bold text-xs text-cyan-400 uppercase block">
            Manual Throttle & Speed Control
          </span>

          {/* Throttle Slider */}
          <div className="space-y-1 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Electronic Throttle (Hall Sensor)</span>
              <strong className="text-cyan-400">{Math.round(vehicleState.throttlePercent)}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={vehicleState.throttlePercent}
              onChange={(e) => {
                const val = Number(e.target.value);
                onUpdateState({
                  throttlePercent: val,
                  speed: (val / 100) * 85,
                  rpm: (val / 100) * 4800,
                  batteryCurrent: (val / 100) * 60,
                  batteryPowerKw: ((val / 100) * 60 * vehicleState.batteryVoltage) / 1000,
                });
              }}
              className="w-full accent-cyan-400"
            />
          </div>

          {/* Speed Direct Override */}
          <div className="space-y-1 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Target Vehicle Speed</span>
              <strong className="text-emerald-400">{Math.round(vehicleState.speed)} KM/H</strong>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              value={vehicleState.speed}
              onChange={(e) => {
                const spd = Number(e.target.value);
                onUpdateState({
                  speed: spd,
                  rpm: (spd / 120) * 5500,
                  throttlePercent: (spd / 120) * 100,
                  batteryCurrent: (spd / 120) * 50,
                  batteryPowerKw: ((spd / 120) * 50 * vehicleState.batteryVoltage) / 1000,
                });
              }}
              className="w-full accent-emerald-400"
            />
          </div>

          {/* Battery SoC Slider */}
          <div className="space-y-1 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Simulate Battery Percentage</span>
              <strong className="text-amber-400">{vehicleState.batteryPercent}%</strong>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={vehicleState.batteryPercent}
              onChange={(e) => {
                const pct = Number(e.target.value);
                onUpdateState({
                  batteryPercent: pct,
                  estimatedRangeKm: Math.round((pct / 100) * 95),
                });
              }}
              className="w-full accent-amber-400"
            />
          </div>
        </div>

        {/* Thermal Overload & Fault Injector */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
          <span className="font-mono font-bold text-xs text-red-400 uppercase block">
            Fault Injection & Emergency Safety Test Lab
          </span>

          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {/* Inject Motor Overheat */}
            <button
              onClick={() => {
                onUpdateState({ motorTemp: 88 });
                onTriggerAlert(
                  'MOTOR THERMAL OVERLOAD',
                  'Motor stator temp exceeded 85°C. Power derated by controller.',
                  'CRITICAL'
                );
              }}
              className="p-3 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 font-bold flex flex-col items-center justify-center gap-1 text-center"
            >
              <Flame className="w-5 h-5 text-red-400" />
              <span>Simulate Motor Overheat (88°C)</span>
            </button>

            {/* Inject Low Battery */}
            <button
              onClick={() => {
                onUpdateState({ batteryPercent: 12, estimatedRangeKm: 8 });
                onTriggerAlert(
                  'LOW BATTERY WARNING',
                  'Battery SoC dropped below 15%. Eco mode automatically engaged.',
                  'WARNING'
                );
              }}
              className="p-3 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-800 font-bold flex flex-col items-center justify-center gap-1 text-center"
            >
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span>Simulate Low Battery (12%)</span>
            </button>

            {/* Simulate Charger Connection */}
            <button
              onClick={() => {
                const chargingNow = !vehicleState.isCharging;
                onUpdateState({
                  isCharging: chargingNow,
                  chargerType: chargingNow ? 'DC_FAST' : 'DISCONNECTED',
                  speed: chargingNow ? 0 : vehicleState.speed,
                  gear: chargingNow ? 'P' : vehicleState.gear,
                });
                if (chargingNow) {
                  onTriggerAlert(
                    'CHARGER PLUGGED IN',
                    'DC Fast Charger connected. Drive gear locked to Park for safety.',
                    'INFO'
                  );
                }
              }}
              className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 text-center ${
                vehicleState.isCharging
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>{vehicleState.isCharging ? 'Unplug Charger' : 'Connect DC Fast Charger'}</span>
            </button>

            {/* Reset Normal Conditions */}
            <button
              onClick={() => {
                onUpdateState({
                  motorTemp: 42,
                  controllerTemp: 38,
                  batteryPercent: 88,
                  isCharging: false,
                  chargerType: 'DISCONNECTED',
                  killSwitchActive: false,
                  activeAlerts: [],
                });
              }}
              className="p-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border border-cyan-800 font-bold flex flex-col items-center justify-center gap-1 text-center"
            >
              <RefreshCw className="w-5 h-5 text-cyan-400" />
              <span>Reset Normal Parameters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
