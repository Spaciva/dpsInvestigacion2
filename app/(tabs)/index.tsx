import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSensorData } from '@/providers/sensor-provider';

export default function DashboardScreen() {
  const { temperature, humidity, lastUpdate } = useSensorData();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Dashboard IoT
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Datos en tiempo real simulados de temperatura y humedad
        </ThemedText>

        <ThemedView style={styles.card} lightColor="#EEF7FF" darkColor="#1D2B3B">
          <ThemedText type="subtitle">Temperatura</ThemedText>
          <ThemedText style={styles.value}>{temperature.toFixed(1)}°C</ThemedText>
          <ThemedText style={styles.note}>Sensor interno simulado</ThemedText>
        </ThemedView>

        <ThemedView style={styles.card} lightColor="#FEFAE7" darkColor="#3B2D1D">
          <ThemedText type="subtitle">Humedad</ThemedText>
          <ThemedText style={styles.value}>{humidity.toFixed(1)}%</ThemedText>
          <ThemedText style={styles.note}>Lectura actualizada cada 3 segundos</ThemedText>
        </ThemedView>

        <ThemedView style={styles.updateCard} lightColor="#F3F7F9" darkColor="#232D35">
          <ThemedText>Última actualización</ThemedText>
          <ThemedText type="defaultSemiBold">{lastUpdate}</ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 20,
    color: '#6B7280',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  value: {
    fontSize: 44,
    fontWeight: '700',
    marginTop: 10,
  },
  note: {
    marginTop: 6,
    color: '#6B7280',
  },
  updateCard: {
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
  },
});
