import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useSensorData from "./hooks/useSensorData";
import ARScreen from "./screens/ARScreen";
import DashboardScreen from "./screens/DashboardScreen";
import styles from "./styles/appStyles";

const Stack = createStackNavigator();

export default function App() {
  const { sensorProps, updateData } = useSensorData();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: styles.header,
            headerTintColor: "#FFF",
          }}
        >
          <Stack.Screen name="Dashboard">
            {(props) => (
              <DashboardScreen
                {...props}
                {...sensorProps}
                onManualUpdate={updateData}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="AR View">
            {(props) => <ARScreen {...props} {...sensorProps} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
