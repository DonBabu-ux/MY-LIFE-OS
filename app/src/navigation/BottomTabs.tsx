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

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type {
  DashboardStackParamList,
  MoneyStackParamList,
  VaultStackParamList,
  PlanStackParamList,
  MoreStackParamList,
} from "./types";
import { DashboardScreen } from "../features/dashboard";
import {
  FinanceDashboardScreen,
  TransactionsListScreen,
  TransactionDetailScreen,
  AddTransactionScreen,
} from "../features/finance";
import {
  ReceiptsListScreen,
  ReceiptDetailScreen,
  ReceiptImportScreen,
} from "../features/receipts";
import {
  ListsScreen as ShoppingListsScreen,
  ListDetailScreen as ShoppingListDetailScreen,
  PriceHistoryScreen,
} from "../features/shopping";
import {
  NotesListScreen,
  NoteEditorScreen,
  TagsManagerScreen,
} from "../features/notes";
import {
  DiaryTimelineScreen,
  DiaryCalendarScreen,
  DiaryEditorScreen,
} from "../features/diary";
import {
  DayViewScreen,
  TaskDetailScreen,
  UpcomingViewScreen,
} from "../features/planner";
import {
  UsageDashboardScreen,
  AppDetailScreen,
  FocusRulesScreen,
} from "../features/usage";
import {
  ActivityDashboardScreen,
  ActivityHistoryScreen,
} from "../features/activity";
import {
  ContactsListScreen,
  ContactDetailScreen,
  DuplicateReviewScreen,
} from "../features/contacts";


const DashboardNav = createNativeStackNavigator<DashboardStackParamList>();
const DashboardStack = () => (
  <DashboardNav.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
    <DashboardNav.Screen name={Routes.DashboardHome} component={DashboardScreen} />
  </DashboardNav.Navigator>
);

const MoneyNav = createNativeStackNavigator<MoneyStackParamList>();
const MoneyStack = () => (
  <MoneyNav.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
    <MoneyNav.Screen name={Routes.FinanceHome} component={FinanceDashboardScreen} />
    <MoneyNav.Screen name={Routes.TransactionsList} component={TransactionsListScreen} />
    <MoneyNav.Screen name={Routes.TransactionDetail} component={TransactionDetailScreen} />
    <MoneyNav.Screen
      name={Routes.AddTransaction}
      component={AddTransactionScreen}
      options={{ animation: "slide_from_bottom" }}
    />
    <MoneyNav.Screen name={Routes.ReceiptsList} component={ReceiptsListScreen} />
    <MoneyNav.Screen name={Routes.ReceiptDetail} component={ReceiptDetailScreen} />
    <MoneyNav.Screen
      name={Routes.ReceiptImport}
      component={ReceiptImportScreen}
      options={{ animation: "slide_from_bottom" }}
    />
    <MoneyNav.Screen name={Routes.ShoppingLists} component={ShoppingListsScreen} />
    <MoneyNav.Screen name={Routes.ShoppingListDetail} component={ShoppingListDetailScreen} />
    <MoneyNav.Screen name={Routes.PriceHistory} component={PriceHistoryScreen} />
  </MoneyNav.Navigator>
);
const VaultNav = createNativeStackNavigator<VaultStackParamList>();
const VaultStack = () => (
  <VaultNav.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
    <VaultNav.Screen name={Routes.NotesList} component={NotesListScreen} />
    <VaultNav.Screen
      name={Routes.NoteEditor}
      component={NoteEditorScreen}
      options={{ animation: "slide_from_right" }}
    />
    <VaultNav.Screen name={Routes.TagsManager} component={TagsManagerScreen} />
    <VaultNav.Screen name={Routes.DiaryTimeline} component={DiaryTimelineScreen} />
    <VaultNav.Screen name={Routes.DiaryCalendar} component={DiaryCalendarScreen} />
    <VaultNav.Screen
      name={Routes.DiaryEditor}
      component={DiaryEditorScreen}
      options={{ animation: "slide_from_right" }}
    />
  </VaultNav.Navigator>
);

const PlanNav = createNativeStackNavigator<PlanStackParamList>();
const PlanStack = () => (
  <PlanNav.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
    <PlanNav.Screen name={Routes.DayView} component={DayViewScreen} />
    <PlanNav.Screen
      name={Routes.TaskDetail}
      component={TaskDetailScreen}
      options={{ animation: "slide_from_bottom" }}
    />
    <PlanNav.Screen name={Routes.Upcoming} component={UpcomingViewScreen} />
  </PlanNav.Navigator>
);

const MoreNav = createNativeStackNavigator<MoreStackParamList>();
const MoreStack = () => (
  <MoreNav.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
    <MoreNav.Screen name={Routes.UsageDashboard} component={UsageDashboardScreen} />
    <MoreNav.Screen name={Routes.AppDetail} component={AppDetailScreen} />
    <MoreNav.Screen name={Routes.FocusRules} component={FocusRulesScreen} />
    <MoreNav.Screen name={Routes.ActivityDashboard} component={ActivityDashboardScreen} />
    <MoreNav.Screen name={Routes.ActivityHistory} component={ActivityHistoryScreen} />
    <MoreNav.Screen name={Routes.ContactsList} component={ContactsListScreen} />
    <MoreNav.Screen name={Routes.ContactDetail} component={ContactDetailScreen} />
    <MoreNav.Screen name={Routes.DuplicateReview} component={DuplicateReviewScreen} />
  </MoreNav.Navigator>
);

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
