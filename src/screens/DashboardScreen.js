import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity
} from "react-native";
import MetricCard from "../components/MetricCard";
import styles from "../styles/appStyles";

export default function DashboardScreen({
  navigation,
  temperature,
  humidity,
  location,
  status,
  lastUpdate,
  onManualUpdate,
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.title}>Dashboard IoT</Text>
        <Text style={styles.subtitle}>
          Datos simulados de temperatura y humedad.
        </Text>

        <MetricCard
          label="Temperatura"
          value={`${temperature.toFixed(1)}°C`}
          note={`Última actualización: ${lastUpdate}`}
        />

        <MetricCard
          alt
          label="Humedad"
          value={`${humidity.toFixed(1)}%`}
          note={`Ubicación: ${location}`}
        />

        <MetricCard label="Estado del sensor" value={status} />

        <TouchableOpacity style={styles.button} onPress={onManualUpdate}>
          <Text style={styles.buttonText}>Actualizar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => navigation.navigate("AR View")}
        >
          <Text style={styles.buttonText}>Ir a Realidad Aumentada</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
