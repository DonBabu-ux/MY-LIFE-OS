import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { useTheme } from "@design";
import type { BottomTabParamList } from "./types";
import { Routes } from "./routes";
import { Icon } from "../components/primitives/Icon";

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
import { MoreHubScreen } from "../screens/MoreHubScreen";

// Tab definitions with crisp vector icon names & theme accent colors
const TABS = [
  { icon: "home", label: "Home", color: "#6366F1" },
  { icon: "cash", label: "Money", color: "#10B981" },
  { icon: "lock-closed", label: "Vault", color: "#8B5CF6" },
  { icon: "calendar", label: "Plan", color: "#F59E0B" },
  { icon: "grid", label: "More", color: "#06B6D4" },
];

// ─── Stacks ────────────────────────────────────────────────────────────────────
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
    <MoneyNav.Screen name={Routes.AddTransaction} component={AddTransactionScreen} options={{ animation: "slide_from_bottom" }} />
    <MoneyNav.Screen name={Routes.ReceiptsList} component={ReceiptsListScreen} />
    <MoneyNav.Screen name={Routes.ReceiptDetail} component={ReceiptDetailScreen} />
    <MoneyNav.Screen name={Routes.ReceiptImport} component={ReceiptImportScreen} options={{ animation: "slide_from_bottom" }} />
    <MoneyNav.Screen name={Routes.ShoppingLists} component={ShoppingListsScreen} />
    <MoneyNav.Screen name={Routes.ShoppingListDetail} component={ShoppingListDetailScreen} />
    <MoneyNav.Screen name={Routes.PriceHistory} component={PriceHistoryScreen} />
  </MoneyNav.Navigator>
);

const VaultNav = createNativeStackNavigator<VaultStackParamList>();
const VaultStack = () => (
  <VaultNav.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
    <VaultNav.Screen name={Routes.NotesList} component={NotesListScreen} />
    <VaultNav.Screen name={Routes.NoteEditor} component={NoteEditorScreen} options={{ animation: "slide_from_right" }} />
    <VaultNav.Screen name={Routes.TagsManager} component={TagsManagerScreen} />
    <VaultNav.Screen name={Routes.DiaryTimeline} component={DiaryTimelineScreen} />
    <VaultNav.Screen name={Routes.DiaryCalendar} component={DiaryCalendarScreen} />
    <VaultNav.Screen name={Routes.DiaryEditor} component={DiaryEditorScreen} options={{ animation: "slide_from_right" }} />
  </VaultNav.Navigator>
);

const PlanNav = createNativeStackNavigator<PlanStackParamList>();
const PlanStack = () => (
  <PlanNav.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
    <PlanNav.Screen name={Routes.DayView} component={DayViewScreen} />
    <PlanNav.Screen name={Routes.TaskDetail} component={TaskDetailScreen} options={{ animation: "slide_from_bottom" }} />
    <PlanNav.Screen name={Routes.Upcoming} component={UpcomingViewScreen} />
  </PlanNav.Navigator>
);

const MoreNav = createNativeStackNavigator<MoreStackParamList>();
const MoreStack = () => (
  <MoreNav.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
    <MoreNav.Screen name={Routes.MoreHub} component={MoreHubScreen} />
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

// ─── Custom Tab Bar ────────────────────────────────────────────────────────────
type CustomTabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, navigation }) => {
  const theme = useTheme();

  return (
    <View style={[styles.tabBarOuter, { backgroundColor: theme.colors.bg }]}>
      <View style={[styles.tabBar, {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
      }]}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const tab = TABS[index];

          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={tab.label}
            >
              <View style={[
                styles.tabIconWrap,
                isFocused && { backgroundColor: `${tab.color}18`, borderRadius: 12 },
              ]}>
                <Icon
                  name={isFocused ? tab.icon : `${tab.icon}-outline`}
                  size={20}
                  color={isFocused ? tab.color : theme.colors.textMuted}
                />
                {isFocused && (
                  <View style={[styles.tabDot, { backgroundColor: tab.color }]} />
                )}
              </View>
              <Text style={[
                styles.tabLabel,
                {
                  color: isFocused ? tab.color : theme.colors.textMuted,
                  fontWeight: isFocused ? "700" : "500",
                },
              ]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabs: React.FC = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name={Routes.TabDashboard} component={DashboardStack} />
    <Tab.Screen name={Routes.TabMoney}     component={MoneyStack} />
    <Tab.Screen name={Routes.TabVault}     component={VaultStack} />
    <Tab.Screen name={Routes.TabPlan}      component={PlanStack} />
    <Tab.Screen name={Routes.TabMore}      component={MoreStack} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBarOuter: {
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === "ios" ? 20 : 6,
    paddingTop: 4,
  },
  tabBar: {
    flexDirection: "row",
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 3,
  },
  tabIconWrap: {
    width: 42,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  tabDot: {
    position: "absolute",
    bottom: -1,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
});

export default BottomTabs;
