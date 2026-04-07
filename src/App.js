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
import { Camera, CameraType } from 'expo-camera';

const Stack = createStackNavigator();

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function DashboardScreen({ navigation, temperature, humidity, lastUpdate }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.title}>Dashboard IoT</Text>
        <Text style={styles.subtitle}>Datos simulados de temperatura y humedad, actualizados cada 3 segundos.</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Temperatura</Text>
          <Text style={styles.cardValue}>{temperature.toFixed(1)}°C</Text>
          <Text style={styles.cardNote}>Sensor virtual integrado</Text>
        </View>

        <View style={[styles.card, styles.cardAlt]}>
          <Text style={styles.cardLabel}>Humedad</Text>
          <Text style={styles.cardValue}>{humidity.toFixed(1)}%</Text>
          <Text style={styles.cardNote}>Lectura actualizada cada 3 segundos</Text>
        </View>

        <View style={styles.updateCard}>
          <Text style={styles.updateLabel}>Última actualización</Text>
          <Text style={styles.updateValue}>{lastUpdate}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AR View')}>
          <Text style={styles.buttonText}>Ir a Realidad Aumentada</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ARScreen({ temperature, humidity, lastUpdate }) {
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    let mounted = true;

    Camera.requestCameraPermissionsAsync().then(({ status }) => {
      if (mounted) setPermission(status);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (permission === null) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color="#34D399" />
        <Text style={styles.permissionText}>Solicitando acceso a la cámara...</Text>
      </View>
    );
  }

  if (permission !== 'granted') {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Permiso de cámara denegado.</Text>
        <Text style={styles.permissionSubtext}>Activa la cámara en la configuración y reinicia la app.</Text>
      </View>
    );
  }

  return (
    <View style={styles.cameraScreen}>
      <Camera style={styles.camera} type={CameraType.back}>
        <View style={styles.overlay}> 
          <Text style={styles.overlayTitle}>Sensor AR</Text>
          <Text style={styles.overlayText}>Temperatura: {temperature.toFixed(1)}°C</Text>
          <Text style={styles.overlayText}>Humedad: {humidity.toFixed(1)}%</Text>
          <Text style={styles.overlayNote}>Última actualización: {lastUpdate}</Text>
        </View>
      </Camera>
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
    <GestureHandlerRootView style={styles.root}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Dashboard"
          screenOptions={{
            headerStyle: styles.header,
            headerTintColor: '#F8FAFC',
            contentStyle: styles.contentBackground,
          }}>
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#0F172A',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  contentBackground: {
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  screen: {
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 6,
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 20,
    lineHeight: 24,
  },
  card: {
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    padding: 22,
    marginBottom: 18,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  cardAlt: {
    backgroundColor: '#FEF3C7',
  },
  cardLabel: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 10,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 44,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardNote: {
    marginTop: 10,
    color: '#64748B',
    fontSize: 14,
  },
  updateCard: {
    borderRadius: 18,
    padding: 18,
    backgroundColor: '#E2E8F0',
    marginBottom: 28,
  },
  updateLabel: {
    color: '#334155',
    marginBottom: 6,
  },
  updateValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  button: {
    backgroundColor: '#0284C7',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0F172A',
  },
  permissionText: {
    marginTop: 18,
    color: '#E2E8F0',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  permissionSubtext: {
    marginTop: 10,
    color: '#94A3B8',
    textAlign: 'center',
    fontSize: 14,
  },
  cameraScreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(124, 255, 88, 0.4)',
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
  },
  overlayTitle: {
    color: '#7CFF58',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  overlayText: {
    color: '#B8FFAA',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  overlayNote: {
    marginTop: 10,
    color: '#CBD5E1',
    fontSize: 13,
  },
});