import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Speedometer } from './components/Speedometer';
import { BatteryGauge } from './components/BatteryGauge';
import { MotorTempCard } from './components/MotorTempCard';
import { QuickStatsCard } from './components/QuickStatsCard';
import { VehicleControls } from './components/VehicleControls';
import { LiveTelemetryChart } from './components/LiveTelemetryChart';
import { EmergencyAlerts } from './components/EmergencyAlerts';
import { HistoryView } from './components/views/HistoryView';
import { AIDiagnosticsView } from './components/views/AIDiagnosticsView';
import { SimulationBar } from './components/views/SimulationBar';
import {
  VehicleState,
  TelemetryPoint,
  DriveMode,
  GearState,
  RegenLevel,
  AlertMessage,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'ai-diagnostics' | 'simulation'>(
    'dashboard'
  );
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Initial EV Controller State
  const [vehicleState, setVehicleState] = useState<VehicleState>({
    speed: 42,
    targetSpeed: 45,
    rpm: 2450,
    gear: 'D',
    driveMode: 'CITY',
    throttlePercent: 35,
    brakeApplied: false,
    regenLevel: 'MEDIUM',

    batteryPercent: 88,
    batteryVoltage: 72.4,
    batteryCurrent: 18.5,
    batteryPowerKw: 1.34,
    cellBalancing: [
      3.62, 3.61, 3.63, 3.62, 3.61, 3.62, 3.63, 3.62, 3.61, 3.62, 3.63, 3.62, 3.61, 3.62, 3.63,
      3.62, 3.61, 3.62, 3.63, 3.62,
    ],
    stateOfHealth: 95.5,

    motorTemp: 44,
    controllerTemp: 38,
    batteryTemp: 31,
    ambientTemp: 28,

    estimatedRangeKm: 84,
    tripDistanceKm: 18.4,
    totalOdometerKm: 1240,
    rideTimeSeconds: 1680, // 28 mins
    energyEfficiencyWhKm: 50,

    lights: {
      headlights: true,
      highBeam: false,
      fogLights: false,
      indicatorLeft: false,
      indicatorRight: false,
      hazard: false,
      brakeLight: false,
      underglow: true,
    },

    isCharging: false,
    chargerType: 'DISCONNECTED',
    chargePowerKw: 0,
    chargeTimeRemainingMin: 0,

    absActive: false,
    kickstandDown: false,
    killSwitchActive: false,
    emergencyAlert: false,
    activeAlerts: [
      {
        id: 'ALT-1',
        type: 'INFO',
        title: 'CAN BUS CONNECTED',
        description: 'Controller MCU synchronized at 500kbps. Regenerative brake level set to MEDIUM.',
        timestamp: 'Just now',
      },
    ],
  });

  // Telemetry stream history for live charts (last 20 points)
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>(() => {
    const initialPoints: TelemetryPoint[] = [];
    const now = new Date();
    for (let i = 15; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 3000);
      const timeStr = `${t.getHours().toString().padStart(2, '0')}:${t
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${t.getSeconds().toString().padStart(2, '0')}`;
      initialPoints.push({
        time: timeStr,
        speed: 38 + Math.floor(Math.sin(i) * 6),
        batteryCurrent: 16 + Math.floor(Math.cos(i) * 5),
        motorTemp: 40 + Math.floor(i * 0.2),
        controllerTemp: 36 + Math.floor(i * 0.1),
        throttle: 30 + Math.floor(Math.sin(i) * 10),
        powerKw: 1.2,
      });
    }
    return initialPoints;
  });

  // Simulation Interval Loop
  useEffect(() => {
    if (!isSimulating || vehicleState.killSwitchActive || vehicleState.gear === 'P') return;

    const interval = setInterval(() => {
      setVehicleState((prev) => {
        // Calculate dynamic variations
        let newSpeed = prev.speed;
        let newCurrent = prev.batteryCurrent;
        let newMotorTemp = prev.motorTemp;
        let newDistance = prev.tripDistanceKm;
        let newRideTime = prev.rideTimeSeconds + 1;

        if (prev.brakeApplied) {
          newSpeed = Math.max(0, prev.speed - 3.5);
          newCurrent = prev.regenLevel === 'OFF' ? 0 : -12.5; // Negative current = Regen charging
        } else if (prev.isCharging) {
          newSpeed = 0;
          newCurrent = -25.0;
        } else {
          // Slight natural cruising speed oscillation
          const target =
            prev.driveMode === 'ECO'
              ? 35
              : prev.driveMode === 'CITY'
              ? 48
              : prev.driveMode === 'SPORT'
              ? 68
              : 85;

          const speedDelta = (target - prev.speed) * 0.08;
          newSpeed = Math.min(120, Math.max(0, prev.speed + speedDelta + (Math.random() - 0.5) * 1.5));
          newCurrent = Math.max(2, (newSpeed / 120) * 45 + (Math.random() - 0.5) * 2);

          // Slowly heat motor if speed > 50
          if (newSpeed > 50 && prev.motorTemp < 78) {
            newMotorTemp = Math.min(85, prev.motorTemp + 0.1);
          } else if (newSpeed < 30 && prev.motorTemp > 38) {
            newMotorTemp = Math.max(35, prev.motorTemp - 0.1);
          }

          // Accumulate trip distance (km)
          newDistance += (newSpeed / 3600);
        }

        const newRpm = (newSpeed / 120) * 5200;
        const newThrottle = Math.min(100, Math.max(0, (newSpeed / 90) * 100));
        const newPowerKw = (newCurrent * prev.batteryVoltage) / 1000;

        // Battery discharge calculation
        const dischargeRate = newCurrent > 0 ? 0.003 : -0.005;
        const newBatteryPercent = Math.min(100, Math.max(1, prev.batteryPercent - dischargeRate));
        const newEstRange = Math.round((newBatteryPercent / 100) * 92);

        // Append to telemetry stream
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        setTelemetryHistory((hist) => {
          const updated = [
            ...hist.slice(1),
            {
              time: timeStr,
              speed: Math.round(newSpeed),
              batteryCurrent: Number(newCurrent.toFixed(1)),
              motorTemp: Math.round(newMotorTemp),
              controllerTemp: Math.round(prev.controllerTemp),
              throttle: Math.round(newThrottle),
              powerKw: Number(newPowerKw.toFixed(2)),
            },
          ];
          return updated;
        });

        return {
          ...prev,
          speed: newSpeed,
          rpm: newRpm,
          throttlePercent: newThrottle,
          batteryCurrent: newCurrent,
          batteryPowerKw: newPowerKw,
          motorTemp: newMotorTemp,
          batteryPercent: Number(newBatteryPercent.toFixed(1)),
          estimatedRangeKm: newEstRange,
          tripDistanceKm: newDistance,
          rideTimeSeconds: newRideTime,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating, vehicleState.killSwitchActive, vehicleState.gear]);

  // Handlers
  const handleSelectDriveMode = (mode: DriveMode) => {
    setVehicleState((prev) => ({ ...prev, driveMode: mode }));
  };

  const handleSelectGear = (gear: GearState) => {
    setVehicleState((prev) => ({
      ...prev,
      gear,
      speed: gear === 'P' ? 0 : prev.speed,
      rpm: gear === 'P' ? 0 : prev.rpm,
    }));
  };

  const handleToggleLight = (lightKey: keyof VehicleState['lights']) => {
    setVehicleState((prev) => ({
      ...prev,
      lights: {
        ...prev.lights,
        [lightKey]: !prev.lights[lightKey],
      },
    }));
  };

  const handleSetRegenLevel = (level: RegenLevel) => {
    setVehicleState((prev) => ({ ...prev, regenLevel: level }));
  };

  const handleToggleBrake = () => {
    setVehicleState((prev) => ({
      ...prev,
      brakeApplied: !prev.brakeApplied,
      lights: { ...prev.lights, brakeLight: !prev.brakeApplied },
    }));
  };

  const handleToggleKillSwitch = () => {
    setVehicleState((prev) => ({
      ...prev,
      killSwitchActive: !prev.killSwitchActive,
      speed: !prev.killSwitchActive ? 0 : prev.speed,
      rpm: !prev.killSwitchActive ? 0 : prev.rpm,
      throttlePercent: !prev.killSwitchActive ? 0 : prev.throttlePercent,
      gear: !prev.killSwitchActive ? 'P' : prev.gear,
    }));
  };

  const handleResetTrip = () => {
    setVehicleState((prev) => ({
      ...prev,
      tripDistanceKm: 0,
      rideTimeSeconds: 0,
    }));
  };

  const handleDismissAlert = (id: string) => {
    setVehicleState((prev) => ({
      ...prev,
      activeAlerts: prev.activeAlerts.filter((a) => a.id !== id),
    }));
  };

  const handleTriggerAlert = (
    title: string,
    description: string,
    type: 'WARNING' | 'CRITICAL'
  ) => {
    const newAlert: AlertMessage = {
      id: `ALT-${Date.now()}`,
      type,
      title,
      description,
      timestamp: 'Just now',
    };
    setVehicleState((prev) => ({
      ...prev,
      activeAlerts: [newAlert, ...prev.activeAlerts],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation Header */}
      <Header
        vehicleState={vehicleState}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        onResetTrip={handleResetTrip}
        onToggleKillSwitch={handleToggleKillSwitch}
        activeTab={activeTab}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          batteryPercent={vehicleState.batteryPercent}
          isCharging={vehicleState.isCharging}
          motorTemp={Math.round(vehicleState.motorTemp)}
        />

        {/* Main View Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">
          {/* Active Emergency Alerts Banner */}
          <EmergencyAlerts
            alerts={vehicleState.activeAlerts}
            onDismissAlert={handleDismissAlert}
            killSwitchActive={vehicleState.killSwitchActive}
          />

          {/* TAB 1: HOME DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick Telemetry Metric Cards */}
              <QuickStatsCard
                tripDistanceKm={vehicleState.tripDistanceKm}
                totalOdometerKm={vehicleState.totalOdometerKm}
                rideTimeSeconds={vehicleState.rideTimeSeconds}
                energyEfficiencyWhKm={vehicleState.energyEfficiencyWhKm}
                avgSpeedKmH={39.4}
              />

              {/* Main Gauge Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* 1. Circular Digital Speedometer */}
                <Speedometer
                  speed={vehicleState.speed}
                  rpm={vehicleState.rpm}
                  maxSpeed={120}
                  driveMode={vehicleState.driveMode}
                  gear={vehicleState.gear}
                  throttlePercent={vehicleState.throttlePercent}
                  powerKw={vehicleState.batteryPowerKw}
                  onSelectDriveMode={handleSelectDriveMode}
                  onSelectGear={handleSelectGear}
                />

                {/* 2. Battery Management System (BMS) Card */}
                <BatteryGauge
                  batteryPercent={vehicleState.batteryPercent}
                  batteryVoltage={vehicleState.batteryVoltage}
                  batteryCurrent={vehicleState.batteryCurrent}
                  batteryPowerKw={vehicleState.batteryPowerKw}
                  estimatedRangeKm={vehicleState.estimatedRangeKm}
                  isCharging={vehicleState.isCharging}
                  chargerType={vehicleState.chargerType}
                  stateOfHealth={vehicleState.stateOfHealth}
                  cellBalancing={vehicleState.cellBalancing}
                />

                {/* 3. Motor & Inverter Thermal Monitoring */}
                <MotorTempCard
                  motorTemp={Math.round(vehicleState.motorTemp)}
                  controllerTemp={Math.round(vehicleState.controllerTemp)}
                  batteryTemp={Math.round(vehicleState.batteryTemp)}
                  ambientTemp={vehicleState.ambientTemp}
                />
              </div>

              {/* Vehicle Actuators & Lighting Switch Bank */}
              <VehicleControls
                lights={vehicleState.lights}
                regenLevel={vehicleState.regenLevel}
                brakeApplied={vehicleState.brakeApplied}
                absActive={vehicleState.absActive}
                onToggleLight={handleToggleLight}
                onSetRegenLevel={handleSetRegenLevel}
                onToggleBrake={handleToggleBrake}
              />

              {/* Live Real-time Telemetry Recharts Stream */}
              <LiveTelemetryChart data={telemetryHistory} />
            </div>
          )}

          {/* TAB 2: SECOND PAGE - HISTORY & ANALYTICS */}
          {activeTab === 'history' && <HistoryView />}

          {/* TAB 3: AI DIAGNOSTICS & HARDWARE LAB */}
          {activeTab === 'ai-diagnostics' && <AIDiagnosticsView />}

          {/* TAB 4: VEHICLE SIMULATION & TESTING */}
          {activeTab === 'simulation' && (
            <SimulationBar
              vehicleState={vehicleState}
              onUpdateState={(updates) => setVehicleState((prev) => ({ ...prev, ...updates }))}
              onTriggerAlert={handleTriggerAlert}
            />
          )}
        </main>
      </div>
    </div>
  );
}
