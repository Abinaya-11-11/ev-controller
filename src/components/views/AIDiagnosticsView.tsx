import React, { useState } from 'react';
import {
  BrainCircuit,
  Cpu,
  Radio,
  Sliders,
  Sparkles,
  Activity,
  Zap,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Gauge,
  Thermometer,
} from 'lucide-react';
import { MOCK_CAN_FRAMES } from '../../data/mockData';

export const AIDiagnosticsView: React.FC = () => {
  // AI Range Predictor States
  const [riderWeightKg, setRiderWeightKg] = useState<number>(70);
  const [inclineDegree, setInclineDegree] = useState<number>(2);
  const [windSpeedKmh, setWindSpeedKmh] = useState<number>(10);
  const [targetSpeedKmh, setTargetSpeedKmh] = useState<number>(45);

  // Calculated AI predicted efficiency Wh/km and range
  const calculatedWhKm = Math.round(
    38 +
      riderWeightKg * 0.15 +
      inclineDegree * 6.5 +
      windSpeedKmh * 0.4 +
      Math.pow(targetSpeedKmh / 20, 2) * 3
  );
  const predictedRangeKm = Math.round((432 / calculatedWhKm) * (85 / 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold font-mono text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-purple-400" /> AI Predictive Analytics & Controller HW Lab
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Neural Range Estimation, Motor Vibration Anomaly AI Detector & CAN Bus Telemetry Sniffer
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-mono text-xs font-bold">
          XGBoost ML Model Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. AI RANGE PREDICTOR SIMULATOR */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-mono font-bold text-sm text-purple-400 uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> AI Dynamic Range Estimator
            </span>
            <span className="text-[10px] font-mono text-slate-400">Model Accuracy: 98.2%</span>
          </div>

          <p className="text-xs text-slate-400 font-mono">
            Adjust road and payload parameters to see real-time energy efficiency prediction from the AI regression model:
          </p>

          <div className="space-y-3 font-mono text-xs">
            {/* Target Speed Slider */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Cruising Speed</span>
                <strong className="text-cyan-400">{targetSpeedKmh} KM/H</strong>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={targetSpeedKmh}
                onChange={(e) => setTargetSpeedKmh(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Incline Slider */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Road Gradient / Slope</span>
                <strong className="text-amber-400">{inclineDegree}° Elevation</strong>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={inclineDegree}
                onChange={(e) => setInclineDegree(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            {/* Rider Payload */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Payload Weight</span>
                <strong className="text-slate-200">{riderWeightKg} KG</strong>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={riderWeightKg}
                onChange={(e) => setRiderWeightKg(Number(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>
          </div>

          {/* AI Result Box */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-800/60 grid grid-cols-2 gap-3 text-center">
            <div>
              <span className="text-[10px] font-mono text-purple-300 block">PREDICTED CONSUMPTION</span>
              <span className="text-2xl font-black font-mono text-white">{calculatedWhKm}</span>
              <span className="text-xs text-purple-300 font-mono ml-1">Wh/km</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-purple-300 block">ESTIMATED REAL RANGE</span>
              <span className="text-2xl font-black font-mono text-emerald-400">{predictedRangeKm}</span>
              <span className="text-xs text-emerald-400 font-mono ml-1">KM</span>
            </div>
          </div>
        </div>

        {/* 2. MOTOR VIBRATION & THERMAL ANOMALY DETECTOR */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-mono font-bold text-sm text-cyan-400 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Neural Anomaly Detector (FFT Accelerometer)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              HEALTHY (0.02 G)
            </span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Bearing Vibration Frequency (FFT Spectrum):</span>
              <span className="text-cyan-300 font-bold">120 Hz Peak</span>
            </div>
            <div className="w-full bg-slate-900 h-16 rounded-lg p-2 border border-slate-800 flex items-end gap-1">
              {[12, 18, 15, 22, 65, 30, 20, 14, 10, 8, 25, 45, 12, 10, 18].map((val, i) => (
                <div
                  key={i}
                  className="flex-1 bg-cyan-500/80 rounded-t hover:bg-cyan-400 transition-colors"
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              No harmonic bearing wobble or phase alignment fault detected by AI classifier.
            </p>
          </div>

          {/* MCU Hardware Pinout */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <span className="text-slate-400 font-bold block text-cyan-400">
              MCU Pinout & GPIO Telemetry
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">Throttle ADC (PA0)</span>
                <span className="text-white font-bold">1.24 V (Linear)</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">MOSFET PWM (PB6)</span>
                <span className="text-emerald-400 font-bold">20.0 kHz (Duty 35%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CAN BUS FRAME SNIFFER */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="font-mono font-bold text-sm text-cyan-400 uppercase flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" /> CAN Bus Packet Sniffer & Controller Bus Frame Monitor
          </span>
          <span className="text-xs font-mono text-slate-400">Bus Load: 18.4% @ 500 kbps</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-3">CAN ID (Hex)</th>
                <th className="p-3">DLC</th>
                <th className="p-3">Data Payload (Bytes 0 - 7)</th>
                <th className="p-3">Subsystem Signal</th>
                <th className="p-3 text-right">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MOCK_CAN_FRAMES.map((frame) => (
                <tr key={frame.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-cyan-300">{frame.id}</td>
                  <td className="p-3 text-slate-400">{frame.dlc}</td>
                  <td className="p-3 text-emerald-400 font-bold tracking-widest">{frame.dataHex}</td>
                  <td className="p-3 text-slate-200">{frame.description}</td>
                  <td className="p-3 text-right text-slate-400">{frame.frequencyHz} Hz</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
