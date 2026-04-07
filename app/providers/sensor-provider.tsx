import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type SensorState = {
  temperature: number;
  humidity: number;
  lastUpdate: string;
};

const SensorContext = createContext<SensorState | undefined>(undefined);

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function nextReading(current: number, min: number, max: number) {
  const variation = (Math.random() - 0.5) * 1.4;
  return Number(clamp(current + variation, min, max).toFixed(1));
}

export function SensorProvider({ children }: { children: React.ReactNode }) {
  const [temperature, setTemperature] = useState(24.6);
  const [humidity, setHumidity] = useState(57.8);
  const [lastUpdate, setLastUpdate] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const updateValues = () => {
      setTemperature((prev) => nextReading(prev, 20.0, 30.0));
      setHumidity((prev) => nextReading(prev, 35.0, 80.0));
      setLastUpdate(formatTime(new Date()));
    };

    const interval = setInterval(updateValues, 3000);
    updateValues();

    return () => clearInterval(interval);
  }, []);

  const value = useMemo(
    () => ({ temperature, humidity, lastUpdate }),
    [temperature, humidity, lastUpdate]
  );

  return <SensorContext.Provider value={value}>{children}</SensorContext.Provider>;
}

export function useSensorData() {
  const context = useContext(SensorContext);
  if (!context) {
    throw new Error('useSensorData must be used within SensorProvider');
  }
  return context;
}
