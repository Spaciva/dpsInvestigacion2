import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// CAMBIO AQUÍ: Usamos CameraView y el hook de permisos moderno
import { CameraView, useCameraPermissions } from 'expo-camera';

const Stack = createStackNavigator();

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function DashboardScreen({ navigation, temperature, humidity, lastUpdate }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.title}>Dashboard IoT</Text>
        <Text style={styles.subtitle}>Datos simulados de temperatura y humedad (uuu).</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Temperatura</Text>
          <Text style={styles.cardValue}>{temperature.toFixed(1)}°C</Text>
          <Text style={styles.cardNote}>Sensor virtual activo</Text>
        </View>

        <View style={[styles.card, styles.cardAlt]}>
          <Text style={styles.cardLabel}>Humedad</Text>
          <Text style={styles.cardValue}>{humidity.toFixed(1)}%</Text>
          <Text style={styles.cardNote}>Actualización: 3s</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AR View')}>
          <Text style={styles.buttonText}>Ir a Realidad Aumentada</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ARScreen({ temperature, humidity, lastUpdate }) {
  // CAMBIO AQUÍ: Hook moderno de permisos
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    requestPermission();
  }, []);

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
          <Text style={styles.buttonText}>Reintentar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.cameraScreen}>
      {/* CAMBIO AQUÍ: Usamos CameraView */}
      <CameraView style={styles.camera} facing="back">
        <View style={styles.overlay}> 
          <Text style={styles.overlayTitle}>Sensor AR (Guía #8)</Text>
          <Text style={styles.overlayText}>Temp: {temperature.toFixed(1)}°C</Text>
          <Text style={styles.overlayText}>Hum: {humidity.toFixed(1)}%</Text>
          <Text style={styles.overlayNote}>Sincronizado: {lastUpdate}</Text>
        </View>
      </CameraView>
    </View>
  );
}

export default function App() {
  const [temperature, setTemperature] = useState(24.2);
  const [humidity, setHumidity] = useState(58.7);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature((current) => clamp(current + (Math.random() - 0.5) * 1.6, 18, 32));
      setHumidity((current) => clamp(current + (Math.random() - 0.5) * 2.8, 25, 90));
      setLastUpdate(new Date().toLocaleTimeString());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const sensorProps = useMemo(
    () => ({ temperature, humidity, lastUpdate }),
    [temperature, humidity, lastUpdate]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerStyle: styles.header, headerTintColor: '#FFF' }}>
          <Stack.Screen name="Dashboard">
            {(props) => <DashboardScreen {...props} {...sensorProps} />}
          </Stack.Screen>
          <Stack.Screen name="AR View">
            {(props) => <ARScreen {...props} {...sensorProps} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

// ... (Tus estilos se mantienen iguales, están perfectos)
const styles = StyleSheet.create({
  
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#0F172A' },
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  screen: { padding: 20 },
  title: { fontSize: 32, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 16, color: '#475569', marginBottom: 20 },
  card: { borderRadius: 22, backgroundColor: '#FFFFFF', padding: 22, marginBottom: 18, elevation: 5 },
  cardAlt: { backgroundColor: '#FEF3C7' },
  cardLabel: { fontSize: 16, color: '#475569' },
  cardValue: { fontSize: 44, fontWeight: '800' },
  cardNote: { marginTop: 10, color: '#64748B' },
  button: { backgroundColor: '#0284C7', borderRadius: 18, padding: 16, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: '700' },
  permissionContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A' },
  permissionText: { color: '#FFF', marginBottom: 20 },
  cameraScreen: { flex: 1 },
  camera: { flex: 1 },
  overlay: { position: 'absolute', bottom: 24, left: 16, right: 16, backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: 18, borderRadius: 22 },
  overlayTitle: { color: '#7CFF58', fontWeight: '800' },
  overlayText: { color: '#FFF', fontSize: 18 },
  overlayNote: { color: '#CBD5E1', fontSize: 12 }
});