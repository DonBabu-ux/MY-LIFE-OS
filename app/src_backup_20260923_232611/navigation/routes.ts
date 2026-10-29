/**
 * Route name constants. Use these instead of string literals.
 * Example: navigation.navigate(Routes.TransactionDetail, { id })
 */
export const Routes = {
  // Root stack
  Lock: "Lock",
  Onboarding: "Onboarding",
  Main: "Main",
  Settings: "Settings",
  NotFound: "NotFound",

  // Bottom tabs
  TabDashboard: "TabDashboard",
  TabMoney: "TabMoney",
  TabVault: "TabVault",
  TabPlan: "TabPlan",
  TabMore: "TabMore",

  // Dashboard stack
  DashboardHome: "DashboardHome",

  // Money stack
  FinanceHome: "FinanceHome",
  TransactionsList: "TransactionsList",
  TransactionDetail: "TransactionDetail",
  AddTransaction: "AddTransaction",
  ReceiptsList: "ReceiptsList",
  ReceiptDetail: "ReceiptDetail",

  // Vault stack
  NotesList: "NotesList",
  NoteEditor: "NoteEditor",
  DiaryTimeline: "DiaryTimeline",
  DiaryEditor: "DiaryEditor",

  // Plan stack
  DayView: "DayView",
  TaskDetail: "TaskDetail",
  Upcoming: "Upcoming",

  // More stack
  UsageDashboard: "UsageDashboard",
  ActivityDashboard: "ActivityDashboard",
  ContactsList: "ContactsList",
  ReferralHome: "ReferralHome",
} as const;

export type RouteName = typeof Routes[keyof typeof Routes];
