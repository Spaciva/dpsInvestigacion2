import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSensorData } from '@/providers/sensor-provider';

export default function ARScreen() {
  const { temperature, humidity, lastUpdate } = useSensorData();
  const [permission, setPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status === 'granted');
    })();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Realidad Aumentada
      </ThemedText>
      <ThemedText style={styles.caption}>
        Cámara trasera con overlay de datos IoT en tiempo real.
      </ThemedText>

      <View style={styles.cameraWrapper}>
        {permission === null ? (
          <ActivityIndicator size="large" color="#0A84FF" />
        ) : permission === false ? (
          <ThemedText>Permiso de cámara denegado. Activa la cámara y reinicia la app.</ThemedText>
        ) : (
          <Camera style={styles.camera} type={CameraType.back}>
            <View style={styles.overlayCard} pointerEvents="none">
              <ThemedText type="subtitle" style={styles.overlayTitle}>
                Sensor AR
              </ThemedText>
              <ThemedText style={styles.overlayText}>Temperatura: {temperature.toFixed(1)}°C</ThemedText>
              <ThemedText style={styles.overlayText}>Humedad: {humidity.toFixed(1)}%</ThemedText>
              <ThemedText style={styles.overlayNote}>Actualizado: {lastUpdate}</ThemedText>
            </View>
          </Camera>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 8,
  },
  caption: {
    marginBottom: 16,
    color: '#6B7280',
  },
  cameraWrapper: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayCard: {
    margin: 20,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
  },
  overlayTitle: {
    marginBottom: 8,
  },
  overlayText: {
    fontSize: 18,
    marginBottom: 6,
  },
  overlayNote: {
    marginTop: 8,
    color: '#D1D5DB',
  },
});
