import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "./theme"; // asegúrate de usar la ruta correcta

import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import HomeScreen from "./Screens/HomeScreen";
import RemindersScreen from "./Screens/RemindersScreen";
import RecommendationsScreen from "./Screens/RecommendationsScreen";
import AddRecordScreen from "./Screens/AddRecordScreen";
import MoodChartScreen from "./Screens/MoodChartScreen";

const Stack = createStackNavigator();

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.secondary,
    notification: colors.danger,
  },
};

export default function App() {
  return (
    <NavigationContainer theme={customTheme}>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerStyle: { backgroundColor: colors.primary }, headerTintColor: colors.text }}>
        <Stack.Screen name="AddRecord" component={AddRecordScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Reminders" component={RemindersScreen} />
        <Stack.Screen name="MoodChart" component={MoodChartScreen} />
        <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
