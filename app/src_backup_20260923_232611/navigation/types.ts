import type { NavigatorScreenParams } from "@react-navigation/native";
import type { RouteName } from "./routes";

// ---------- Param lists ----------

export type RootStackParamList = {
  Lock: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<BottomTabParamList>;
  Settings: undefined;
  NotFound: undefined;
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
};

export type VaultStackParamList = {
  NotesList: undefined;
  NoteEditor: { id?: string };
  DiaryTimeline: undefined;
  DiaryEditor: { id?: string };
};

export type PlanStackParamList = {
  DayView: undefined;
  TaskDetail: { id: string };
  Upcoming: undefined;
};

export type MoreStackParamList = {
  UsageDashboard: undefined;
  ActivityDashboard: undefined;
  ContactsList: undefined;
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
