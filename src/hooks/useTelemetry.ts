import { useState, useEffect, useCallback } from 'react';

export interface TelemetryData {
  id: string;
  name: string;
  load: number;
  capacity: number;
  voltage: number;
  frequency: number;
  temperature: number;
  health: 'healthy' | 'warning' | 'critical';
  lastUpdate: Date;
}

export interface AlertData {
  id: string;
  type: 'high_load' | 'voltage_drop' | 'overheating' | 'health_degradation';
  severity: 'warning' | 'critical';
  message: string;
  source: string;
  timestamp: Date;
  status: 'created' | 'acknowledged' | 'resolved';
}

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const generateFeederData = (id: string, name: string): TelemetryData => {
  const capacity = randomBetween(80, 200);
  const load = randomBetween(20, capacity * 1.1);
  const voltage = randomBetween(210, 245);
  const temperature = randomBetween(35, 95);
  const loadRatio = load / capacity;
  const health: TelemetryData['health'] =
    loadRatio > 0.95 || voltage < 215 || temperature > 85 ? 'critical' :
    loadRatio > 0.8 || voltage < 225 || temperature > 70 ? 'warning' : 'healthy';

  return { id, name, load, capacity, voltage, frequency: randomBetween(49.8, 50.2), temperature, health, lastUpdate: new Date() };
};

const STATES = [
  { id: 'MH', name: 'Maharashtra' }, { id: 'UP', name: 'Uttar Pradesh' },
  { id: 'TN', name: 'Tamil Nadu' }, { id: 'KA', name: 'Karnataka' },
  { id: 'GJ', name: 'Gujarat' }, { id: 'RJ', name: 'Rajasthan' },
  { id: 'WB', name: 'West Bengal' }, { id: 'MP', name: 'Madhya Pradesh' },
  { id: 'AP', name: 'Andhra Pradesh' }, { id: 'TG', name: 'Telangana' },
  { id: 'DL', name: 'Delhi' }, { id: 'KL', name: 'Kerala' },
  { id: 'PB', name: 'Punjab' }, { id: 'HR', name: 'Haryana' },
  { id: 'BR', name: 'Bihar' }, { id: 'OR', name: 'Odisha' },
  { id: 'JH', name: 'Jharkhand' }, { id: 'CG', name: 'Chhattisgarh' },
  { id: 'AS', name: 'Assam' }, { id: 'GA', name: 'Goa' },
];

const SUBSTATIONS = [
  'Substation Alpha', 'Substation Beta', 'Substation Gamma',
  'Substation Delta', 'Substation Epsilon', 'Substation Zeta',
];

const FEEDERS = [
  'Feeder F-01', 'Feeder F-02', 'Feeder F-03', 'Feeder F-04',
  'Feeder F-05', 'Feeder F-06', 'Feeder F-07', 'Feeder F-08',
];

export function useTelemetry(level: 'national' | 'state' | 'city') {
  const items = level === 'national' ? STATES :
    level === 'state' ? SUBSTATIONS.map((n, i) => ({ id: `SS${i}`, name: n })) :
    FEEDERS.map((n, i) => ({ id: `FD${i}`, name: n }));

  const [data, setData] = useState<TelemetryData[]>(() =>
    items.map(item => generateFeederData(typeof item === 'string' ? item : item.id, typeof item === 'string' ? item : item.name))
  );
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [history, setHistory] = useState<{ time: string; load: number; voltage: number }[]>([]);

  const updateTelemetry = useCallback(() => {
    setData(prev => prev.map(d => {
      const newLoad = Math.max(10, d.load + randomBetween(-8, 8));
      const newVoltage = Math.max(200, Math.min(250, d.voltage + randomBetween(-3, 3)));
      const newTemp = Math.max(30, Math.min(100, d.temperature + randomBetween(-2, 2)));
      const loadRatio = newLoad / d.capacity;
      const health: TelemetryData['health'] =
        loadRatio > 0.95 || newVoltage < 215 || newTemp > 85 ? 'critical' :
        loadRatio > 0.8 || newVoltage < 225 || newTemp > 70 ? 'warning' : 'healthy';
      return { ...d, load: newLoad, voltage: newVoltage, temperature: newTemp, health, lastUpdate: new Date() };
    }));

    setHistory(prev => {
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      const newEntry = { time, load: randomBetween(60, 90), voltage: randomBetween(220, 240) };
      return [...prev.slice(-19), newEntry];
    });
  }, []);

  useEffect(() => {
    updateTelemetry();
    const interval = setInterval(updateTelemetry, 3000);
    return () => clearInterval(interval);
  }, [updateTelemetry]);

  useEffect(() => {
    const newAlerts: AlertData[] = [];
    data.forEach(d => {
      if (d.load / d.capacity > 0.95) {
        newAlerts.push({
          id: `${d.id}-load-${Date.now()}`, type: 'high_load', severity: 'critical',
          message: `High load on ${d.name}: ${d.load.toFixed(1)}MW / ${d.capacity.toFixed(0)}MW`,
          source: d.name, timestamp: new Date(), status: 'created',
        });
      }
      if (d.voltage < 215) {
        newAlerts.push({
          id: `${d.id}-volt-${Date.now()}`, type: 'voltage_drop', severity: 'critical',
          message: `Voltage drop on ${d.name}: ${d.voltage.toFixed(1)}V`,
          source: d.name, timestamp: new Date(), status: 'created',
        });
      }
      if (d.temperature > 85) {
        newAlerts.push({
          id: `${d.id}-temp-${Date.now()}`, type: 'overheating', severity: 'warning',
          message: `Overheating at ${d.name}: ${d.temperature.toFixed(1)}°C`,
          source: d.name, timestamp: new Date(), status: 'created',
        });
      }
    });
    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 50));
    }
  }, [data]);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'acknowledged' } : a));
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
  };

  return { data, alerts, history, acknowledgeAlert, resolveAlert };
}
