import React, { useState } from 'react';
import {
  History,
  Battery,
  Zap,
  Wrench,
  TrendingUp,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';
import {
  MOCK_RIDE_HISTORY,
  MOCK_BATTERY_HEALTH_GRAPH,
  MOCK_CHARGING_HISTORY,
  MOCK_SERVICE_RECORDS,
  MOCK_DTC_CODES,
} from '../../data/mockData';

export const HistoryView: React.FC = () => {
  const [subTab, setSubTab] = useState<'rides' | 'battery' | 'charging' | 'service'>('rides');
  const [searchQuery, setSearchQuery] = useState('');

  // Export logs alert simulation
  const handleExport = () => {
    alert('Exporting EV Telemetry Data & Logs to CSV / JSON format for AI & DS research analysis...');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Navigation Tabs */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold font-mono text-white flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" /> EV Telemetry & Historical Analytics
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Ride History, Battery State-of-Health (SoH), Charging Performance & Service Records
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 font-mono text-xs font-bold transition-all shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT DATASET (CSV)</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setSubTab('rides')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all border ${
            subTab === 'rides'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Ride History</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950/40 font-mono">
            {MOCK_RIDE_HISTORY.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('battery')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all border ${
            subTab === 'battery'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Battery className="w-4 h-4" />
          <span>Battery Health Graph</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950/40 font-mono">
            SoH 95.5%
          </span>
        </button>

        <button
          onClick={() => setSubTab('charging')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all border ${
            subTab === 'charging'
              ? 'bg-purple-500 text-slate-950 border-purple-400 shadow-lg shadow-purple-500/20'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Charging History</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950/40 font-mono">
            {MOCK_CHARGING_HISTORY.length} Sessions
          </span>
        </button>

        <button
          onClick={() => setSubTab('service')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all border ${
            subTab === 'service'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Service & Diagnostic Logs</span>
        </button>
      </div>

      {/* 1. RIDE HISTORY TAB CONTENT */}
      {subTab === 'rides' && (
        <div className="space-y-4">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-900/90 border border-slate-800/90 p-3.5 rounded-xl">
              <div className="text-[11px] font-mono text-slate-400">Total Tracked Runs</div>
              <div className="text-2xl font-black font-mono text-white mt-1">108 Drives</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800/90 p-3.5 rounded-xl">
              <div className="text-[11px] font-mono text-slate-400">Total Distance Logged</div>
              <div className="text-2xl font-black font-mono text-cyan-400 mt-1">1,240 KM</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800/90 p-3.5 rounded-xl">
              <div className="text-[11px] font-mono text-slate-400">Avg Fleet Efficiency</div>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                52.8 Wh/km
              </div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800/90 p-3.5 rounded-xl">
              <div className="text-[11px] font-mono text-slate-400">Avg Driving Score</div>
              <div className="text-2xl font-black font-mono text-purple-300 mt-1">92 / 100</div>
            </div>
          </div>

          {/* Ride History Table */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-cyan-400 uppercase">
                Recent Ride Telemetry Logs
              </span>
              <span className="text-xs text-slate-500 font-mono">6 Most Recent Trips</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Ride ID / Date</th>
                    <th className="p-3.5">Route / Title</th>
                    <th className="p-3.5">Distance</th>
                    <th className="p-3.5">Duration</th>
                    <th className="p-3.5">Avg/Max Speed</th>
                    <th className="p-3.5">Energy Used</th>
                    <th className="p-3.5">Efficiency</th>
                    <th className="p-3.5">SoC Delta</th>
                    <th className="p-3.5 text-right">Driver Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {MOCK_RIDE_HISTORY.map((ride) => (
                    <tr key={ride.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-slate-300">
                        <div>{ride.id}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{ride.date}</div>
                      </td>
                      <td className="p-3.5 font-semibold text-white">{ride.title}</td>
                      <td className="p-3.5 text-cyan-400 font-bold">{ride.distanceKm} KM</td>
                      <td className="p-3.5 text-slate-300">{ride.durationMin} min</td>
                      <td className="p-3.5 text-slate-300">
                        {ride.avgSpeedKmH} /{' '}
                        <strong className="text-amber-400">{ride.maxSpeedKmH}</strong> KM/H
                      </td>
                      <td className="p-3.5 text-emerald-400 font-bold">
                        {ride.energyUsedKWh} kWh
                      </td>
                      <td className="p-3.5 text-purple-300">{ride.efficiencyWhKm} Wh/km</td>
                      <td className="p-3.5 text-slate-400">
                        {ride.startSoC}% →{' '}
                        <span className="text-cyan-400 font-bold">{ride.endSoC}%</span>
                      </td>
                      <td className="p-3.5 text-right">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {ride.efficiencyScore} / 100
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. BATTERY HEALTH GRAPH TAB CONTENT */}
      {subTab === 'battery' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold font-mono text-emerald-400 flex items-center gap-2">
                  <Battery className="w-5 h-5 text-emerald-400" /> Battery Capacity Degradation Curve
                  (State of Health % vs Cycle Count)
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Long-term LiFePO4 chemical degradation curve tracked across 380+ charge cycles
                </p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-xs font-bold">
                  Current SoH: 95.5%
                </span>
              </div>
            </div>

            {/* Recharts Area Chart for SoH Degradation */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_BATTERY_HEALTH_GRAPH}>
                  <defs>
                    <linearGradient id="sohGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="monthYear" stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'monospace' }} />
                  <YAxis domain={[90, 100]} stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'monospace' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sohPercent"
                    name="State of Health (SoH %)"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#sohGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Internal Resistance & Capacity Bar Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400">
                Cell Internal Resistance (mΩ over time)
              </span>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_BATTERY_HEALTH_GRAPH}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="monthYear" stroke="#64748b" tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#090d16',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                      }}
                    />
                    <Bar dataKey="internalResistanceMOhms" name="Resistance (mΩ)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-mono font-bold text-purple-400">
                Usable Capacity (Ah over time)
              </span>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_BATTERY_HEALTH_GRAPH}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="monthYear" stroke="#64748b" tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
                    <YAxis domain={[55, 62]} stroke="#64748b" tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#090d16',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                      }}
                    />
                    <Line type="monotone" dataKey="capacityAh" name="Capacity (Ah)" stroke="#c084fc" strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CHARGING HISTORY TAB CONTENT */}
      {subTab === 'charging' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_CHARGING_HISTORY.map((chg) => (
              <div
                key={chg.id}
                className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-800">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-mono font-bold text-sm text-white">{chg.stationName}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{chg.date}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {chg.type}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Energy Added</span>
                    <strong className="text-emerald-400 text-sm">{chg.energyAddedKWh} kWh</strong>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Duration</span>
                    <strong className="text-slate-200 text-sm">{chg.durationMin} mins</strong>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">SoC Range</span>
                    <strong className="text-cyan-400 text-sm">
                      {chg.startSoC}% → {chg.endSoC}%
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                  <span>Avg Pack Temp: <strong className="text-amber-400">{chg.avgTempCelsius}°C</strong></span>
                  <span>Cost: <strong className="text-white">₹{chg.costRupees}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SERVICE RECORDS & DIAGNOSTIC LOGS TAB CONTENT */}
      {subTab === 'service' && (
        <div className="space-y-6">
          {/* Diagnostic Trouble Codes (DTC) Section */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-mono font-bold text-sm text-amber-400 uppercase flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" /> Diagnostic Trouble Code (DTC) Error History
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                0 ACTIVE CRITICAL FAULTS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MOCK_DTC_CODES.map((dtc) => (
                <div
                  key={dtc.code}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold text-xs border border-amber-800">
                      CODE {dtc.code}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">{dtc.subsystem}</span>
                  </div>
                  <p className="font-bold text-slate-200">{dtc.description}</p>
                  <p className="text-slate-400 text-[11px]">
                    <strong className="text-slate-300">Cause:</strong> {dtc.possibleCause}
                  </p>
                  <p className="text-cyan-300 text-[11px]">
                    <strong className="text-cyan-400">Recommended Action:</strong> {dtc.recommendedAction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Service Log Checklist */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-mono font-bold text-sm text-cyan-400 uppercase flex items-center gap-2">
                <Wrench className="w-5 h-5 text-cyan-400" /> Maintenance & Software Update Logs
              </span>
              <span className="text-xs text-slate-400 font-mono">Next Due: @ 2,000 KM</span>
            </div>

            <div className="space-y-3">
              {MOCK_SERVICE_RECORDS.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-bold text-white text-sm">{srv.serviceType}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] pl-6">{srv.notes}</p>
                  </div>

                  <div className="flex items-center gap-4 text-slate-400 shrink-0 pl-6 md:pl-0">
                    <div>
                      <div className="text-[10px] text-slate-500">TECHNICIAN</div>
                      <div className="text-slate-200 font-semibold">{srv.technician}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">ODOMETER</div>
                      <div className="text-cyan-400 font-bold">{srv.odometerKm} KM</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
