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
  Playground: "Playground",

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
  ReceiptImport: "ReceiptImport",
  ShoppingLists: "ShoppingLists",
  ShoppingListDetail: "ShoppingListDetail",
  PriceHistory: "PriceHistory",

  // Vault stack
  NotesList: "NotesList",
  NoteEditor: "NoteEditor",
  TagsManager: "TagsManager",
  DiaryTimeline: "DiaryTimeline",
  DiaryCalendar: "DiaryCalendar",
  DiaryEditor: "DiaryEditor",

  // Plan stack
  DayView: "DayView",
  TaskDetail: "TaskDetail",
  Upcoming: "Upcoming",

  // More stack
  UsageDashboard: "UsageDashboard",
  AppDetail: "AppDetail",
  FocusRules: "FocusRules",
  ActivityDashboard: "ActivityDashboard",
  ActivityHistory: "ActivityHistory",
  ContactsList: "ContactsList",
  ContactDetail: "ContactDetail",
  DuplicateReview: "DuplicateReview",
  ReferralHome: "ReferralHome",
} as const;

export type RouteName = typeof Routes[keyof typeof Routes];
