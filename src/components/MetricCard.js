import { Text, View } from "react-native";
import styles from "../styles/appStyles";

export default function MetricCard({ label, value, note, alt }) {
  return (
    <View style={[styles.card, alt && styles.cardAlt]}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      {note ? <Text style={styles.cardNote}>{note}</Text> : null}
    </View>
  );
}
