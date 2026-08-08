import React from 'react';
import { AlertTriangle, ShieldAlert, X, AlertCircle, Info } from 'lucide-react';
import { AlertMessage } from '../types';

interface EmergencyAlertsProps {
  alerts: AlertMessage[];
  onDismissAlert: (id: string) => void;
  killSwitchActive: boolean;
}

export const EmergencyAlerts: React.FC<EmergencyAlertsProps> = ({
  alerts,
  onDismissAlert,
  killSwitchActive,
}) => {
  if (alerts.length === 0 && !killSwitchActive) return null;

  return (
    <div className="space-y-2 mb-4">
      {/* Emergency Kill Switch Banner */}
      {killSwitchActive && (
        <div className="bg-red-950/90 border-2 border-red-500 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600 text-white">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-mono font-extrabold text-sm uppercase tracking-wider text-red-200">
                EMERGENCY KILL SWITCH ENGAGED
              </h3>
              <p className="text-xs font-mono text-red-300">
                Motor PWM disabled. High voltage contactors opened. Disengage kill switch to resume driving.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Alerts */}
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-3 rounded-xl border flex items-center justify-between gap-3 font-mono text-xs shadow-md transition-all ${
            alert.type === 'CRITICAL'
              ? 'bg-red-950/80 border-red-700/80 text-red-200'
              : alert.type === 'WARNING'
              ? 'bg-amber-950/80 border-amber-700/80 text-amber-200'
              : 'bg-cyan-950/80 border-cyan-700/80 text-cyan-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {alert.type === 'CRITICAL' ? (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            ) : alert.type === 'WARNING' ? (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <div>
              <span className="font-bold mr-2 uppercase">[{alert.type}] {alert.title}:</span>
              <span>{alert.description}</span>
            </div>
          </div>

          <button
            onClick={() => onDismissAlert(alert.id)}
            className="p-1 rounded hover:bg-black/30 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
