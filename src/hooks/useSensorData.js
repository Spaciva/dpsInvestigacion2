import { useEffect, useMemo, useState } from "react";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const simulateSensorData = (currentLocation) => ({
  temperature: clamp(20 + Math.random() * 10, 18, 32),
  humidity: clamp(40 + Math.random() * 20, 25, 90),
  location: currentLocation,
  status: "Activo",
});

export default function useSensorData() {
  const [temperature, setTemperature] = useState(24.2);
  const [humidity, setHumidity] = useState(58.7);
  const [location, setLocation] = useState("Laboratorio A");
  const [status, setStatus] = useState("Activo");
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  const updateData = () => {
    const data = simulateSensorData(location);
    setTemperature(data.temperature);
    setHumidity(data.humidity);
    setStatus(data.status);
    setLastUpdate(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 5000);
    return () => clearInterval(interval);
  }, [location]);

  const sensorProps = useMemo(
    () => ({ temperature, humidity, location, status, lastUpdate }),
    [temperature, humidity, location, status, lastUpdate],
  );

  return { sensorProps, updateData, setLocation };
}
