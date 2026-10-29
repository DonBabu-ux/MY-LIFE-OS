import type { NavigatorScreenParams } from "@react-navigation/native";
import type { RouteName } from "./routes";

// ---------- Param lists ----------

export type RootStackParamList = {
  Lock: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<BottomTabParamList>;
  Settings: undefined;
  Updates: undefined;
  NotFound: undefined;
  Playground: undefined;
};

export type BottomTabParamList = {
  TabDashboard: NavigatorScreenParams<DashboardStackParamList>;
  TabMoney: NavigatorScreenParams<MoneyStackParamList>;
  TabVault: NavigatorScreenParams<VaultStackParamList>;
  TabPlan: NavigatorScreenParams<PlanStackParamList>;
  TabMore: NavigatorScreenParams<MoreStackParamList>;
};

export type DashboardStackParamList = {
  DashboardHome: undefined;
};

export type MoneyStackParamList = {
  FinanceHome: undefined;
  TransactionsList: undefined;
  TransactionDetail: { id: string };
  AddTransaction: undefined;
  ReceiptsList: undefined;
  ReceiptDetail: { id: string };
  ReceiptImport: undefined;
  ShoppingLists: undefined;
  ShoppingListDetail: { id: string };
  PriceHistory: { itemKey: string; itemName: string };
};

export type VaultStackParamList = {
  NotesList: undefined;
  NoteEditor: { id?: string };
  TagsManager: undefined;
  DiaryTimeline: undefined;
  DiaryCalendar: undefined;
  DiaryEditor: { id?: string };
};

export type PlanStackParamList = {
  DayView: undefined;
  TaskDetail: { id?: string } | undefined;
  Upcoming: undefined;
};

export type MoreStackParamList = {
  MoreHub: undefined;
  Permissions: undefined;
  UsageDashboard: undefined;
  AppDetail: { appId: string };
  FocusRules: undefined;
  ActivityDashboard: undefined;
  ActivityHistory: undefined;
  ContactsList: undefined;
  ContactDetail: { id: string };
  DuplicateReview: undefined;
  ReferralHome: undefined;
};

// ---------- Global augmentation ----------
// Makes navigation.navigate() and useNavigation() type-safe everywhere.

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type { RouteName };
