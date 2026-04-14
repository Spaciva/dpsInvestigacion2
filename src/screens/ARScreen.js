import { useFocusEffect } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useCallback } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import styles from "../styles/appStyles";

export default function ARScreen({ temperature, humidity, lastUpdate }) {
  const [permission, requestPermission] = useCameraPermissions();

  useFocusEffect(
    useCallback(() => {
      const askPermission = async () => {
        if (!permission?.granted) {
          await requestPermission();
        }
      };
      askPermission();
    }, [permission, requestPermission]),
  );

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color="#34D399" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Permiso de cámara denegado.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Reintentar permiso</Text>
        </TouchableOpacity>
        {!permission.canAskAgain && (
          <Text style={[styles.permissionText, { marginTop: 12 }]}>
            Abre la configuración si no puedes solicitar el permiso otra vez.
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.cameraScreen}>
      <CameraView style={styles.camera} facing="back">
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>Sensor ()</Text>
          <Text style={styles.overlayText}>
            Temp: {temperature.toFixed(1)}°C
          </Text>
          <Text style={styles.overlayText}>Hum: {humidity.toFixed(1)}%</Text>
          <Text style={styles.overlayNote}>Sincronizado: {lastUpdate}</Text>
        </View>
      </CameraView>
    </View>
  );
}
