import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";
import { Routes } from "./routes";
import { BottomTabs } from "./BottomTabs";
import LockScreen from "../screens/LockScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import SettingsScreen from "../screens/SettingsScreen";
import UpdatesScreen from "../screens/UpdatesScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import PlaygroundScreen from "../screens/PlaygroundScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name={Routes.Lock} component={LockScreen} />
      <Stack.Screen name={Routes.Onboarding} component={OnboardingScreen} />
      <Stack.Screen name={Routes.Main} component={BottomTabs} />
      <Stack.Screen
        name={Routes.Settings}
        component={SettingsScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name={Routes.Updates}
        component={UpdatesScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen name={Routes.NotFound} component={NotFoundScreen} />
      <Stack.Screen
        name={Routes.Playground}
        component={PlaygroundScreen}
        options={{ animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
};
