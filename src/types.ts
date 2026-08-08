export type DriveMode = 'ECO' | 'CITY' | 'SPORT' | 'TURBO';
export type GearState = 'P' | 'R' | 'N' | 'D';
export type RegenLevel = 'OFF' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface VehicleState {
  // Speed & Motion
  speed: number; // km/h
  targetSpeed: number;
  rpm: number;
  gear: GearState;
  driveMode: DriveMode;
  throttlePercent: number;
  brakeApplied: boolean;
  regenLevel: RegenLevel;
  
  // Battery
  batteryPercent: number; // SoC
  batteryVoltage: number; // V
  batteryCurrent: number; // A (positive = discharge, negative = regen/charge)
  batteryPowerKw: number; // kW
  cellBalancing: number[]; // e.g. 16 cell voltages in V (e.g. 3.65V)
  stateOfHealth: number; // SoH %
  
  // Temperature (°C)
  motorTemp: number;
  controllerTemp: number;
  batteryTemp: number;
  ambientTemp: number;
  
  // Trip & Range
  estimatedRangeKm: number;
  tripDistanceKm: number;
  totalOdometerKm: number;
  rideTimeSeconds: number;
  energyEfficiencyWhKm: number;
  
  // Lights
  lights: {
    headlights: boolean;
    highBeam: boolean;
    fogLights: boolean;
    indicatorLeft: boolean;
    indicatorRight: boolean;
    hazard: boolean;
    brakeLight: boolean;
    underglow: boolean;
  };
  
  // System Status & Charging
  isCharging: boolean;
  chargerType: 'DISCONNECTED' | 'AC_SLOW' | 'DC_FAST';
  chargePowerKw: number;
  chargeTimeRemainingMin: number;
  
  // Diagnostics & Safety
  absActive: boolean;
  kickstandDown: boolean;
  killSwitchActive: boolean;
  emergencyAlert: boolean;
  activeAlerts: AlertMessage[];
}

export interface AlertMessage {
  id: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  description: string;
  timestamp: string;
  code?: string;
}

export interface TelemetryPoint {
  time: string;
  speed: number;
  batteryCurrent: number;
  motorTemp: number;
  controllerTemp: number;
  throttle: number;
  powerKw: number;
}

export interface RideRecord {
  id: string;
  date: string;
  title: string;
  distanceKm: number;
  durationMin: number;
  avgSpeedKmH: number;
  maxSpeedKmH: number;
  energyUsedKWh: number;
  efficiencyWhKm: number;
  efficiencyScore: number; // 0 - 100
  startSoC: number;
  endSoC: number;
}

export interface BatteryHealthData {
  cycleCount: number;
  sohPercent: number;
  capacityAh: number;
  temperatureCelsius: number;
  monthYear: string;
  internalResistanceMOhms: number;
}

export interface ChargeRecord {
  id: string;
  date: string;
  stationName: string;
  type: 'AC Slow (3.3kW)' | 'DC Fast (25kW)' | 'DC Ultra Fast (50kW)';
  startSoC: number;
  endSoC: number;
  energyAddedKWh: number;
  durationMin: number;
  costRupees: number;
  avgTempCelsius: number;
}

export interface ServiceRecord {
  id: string;
  date: string;
  serviceType: string;
  technician: string;
  odometerKm: number;
  notes: string;
  status: 'COMPLETED' | 'SCHEDULED' | 'PENDING';
  cost: number;
}

export interface DiagnosticDTC {
  code: string;
  subsystem: 'BATTERY' | 'MOTOR' | 'CONTROLLER' | 'BRAKE' | 'SENSOR';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  possibleCause: string;
  recommendedAction: string;
  isCurrent: boolean;
}

export interface CANFrame {
  id: string; // e.g. 0x18F00503
  dlc: number;
  dataHex: string;
  description: string;
  frequencyHz: number;
  lastUpdated: string;
}
