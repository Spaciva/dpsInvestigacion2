import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useCameraPermissions } from "expo-camera";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useSensorData from "./hooks/useSensorData";
import ARScreen from "./screens/ARScreen";
import DashboardScreen from "./screens/DashboardScreen";
import styles from "./styles/appStyles";

const Stack = createStackNavigator();

export default function App() {
  const { sensorProps, updateData, setLocation, availableLocations } =
    useSensorData();
  const [permission, requestPermission] = useCameraPermissions();

  const handleGoToAR = async (navigation) => {
    if (permission?.granted) {
      navigation.navigate("AR View");
      return;
    }

    const response = await requestPermission();
    if (response.granted) {
      navigation.navigate("AR View");
    }
  };

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
                onNavigateToAR={handleGoToAR}
                onChangeLocation={setLocation}
                availableLocations={availableLocations}
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
