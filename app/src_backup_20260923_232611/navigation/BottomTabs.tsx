import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import { useTheme } from "@design";
import type { BottomTabParamList } from "./types";
import { Routes } from "./routes";

// Placeholder screens  real ones arrive in A6.
const Placeholder: React.FC<{ label: string }> = ({ label }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.bg,
      }}
    >
      <Text style={{ color: theme.colors.text, fontSize: 20 }}>{label}</Text>
    </View>
  );
};

const DashboardStack = () => <Placeholder label="Dashboard" />;
const MoneyStack = () => <Placeholder label="Money" />;
const VaultStack = () => <Placeholder label="Vault" />;
const PlanStack = () => <Placeholder label="Plan" />;
const MoreStack = () => <Placeholder label="More" />;

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabIcon: React.FC<{ focused: boolean; label: string }> = ({ focused, label }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: focused ? theme.colors.accent : theme.colors.textMuted,
        }}
      >
        {label.charAt(0)}
      </Text>
    </View>
  );
};

export const BottomTabs: React.FC = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tab.Screen
        name={Routes.TabDashboard}
        component={DashboardStack}
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Home" />,
        }}
      />
      <Tab.Screen
        name={Routes.TabMoney}
        component={MoneyStack}
        options={{
          title: "Money",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Money" />,
        }}
      />
      <Tab.Screen
        name={Routes.TabVault}
        component={VaultStack}
        options={{
          title: "Vault",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Vault" />,
        }}
      />
      <Tab.Screen
        name={Routes.TabPlan}
        component={PlanStack}
        options={{
          title: "Plan",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Plan" />,
        }}
      />
      <Tab.Screen
        name={Routes.TabMore}
        component={MoreStack}
        options={{
          title: "More",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="More" />,
        }}
      />
    </Tab.Navigator>
  );
};
