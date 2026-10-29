import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@design";
import {
  Screen,
  Header,
  Card,
  Text,
  Button,
  Badge,
  StatTile,
  Icon,
} from "../../../components";
import { Routes } from "../../../navigation/routes";
import { useFinanceStore } from "../state/financeSlice";
import { CashflowChart } from "../components/CashflowChart";
import { CategoryBreakdown } from "../components/CategoryBreakdown";
import { TransactionRow } from "../components/TransactionRow";

type Period = "today" | "week" | "month" | "year";

export const FinanceDashboardScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const [period, setPeriod] = useState<Period>("month");
  const [refreshing, setRefreshing] = useState(false);

  const transactions = useFinanceStore((state) => state.transactions);
  const categories = useFinanceStore((state) => state.categories);
  const getSummary = useFinanceStore((state) => state.getSummary);
  const getCategoryById = useFinanceStore((state) => state.getCategoryById);

  const summary = getSummary();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }, []);

  // Compute metrics for the active period
  let periodIncome = summary.monthIncome;
  let periodExpense = summary.monthExpense;
  let periodLabel = "This Month";

  if (period === "today") {
    periodIncome = summary.todayIncome;
    periodExpense = summary.todayExpense;
    periodLabel = "Today";
  } else if (period === "week") {
    periodIncome = summary.weekIncome;
    periodExpense = summary.weekExpense;
    periodLabel = "This Week";
  } else if (period === "year") {
    periodIncome = summary.yearIncome;
    periodExpense = summary.yearExpense;
    periodLabel = "This Year";
  }

  const periodNet = periodIncome - periodExpense;
  const isNetPositive = periodNet >= 0;

  const formatKes = (amountMinor: number) => {
    return `KES ${(amountMinor / 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <Screen style={styles.container}>
      <Header
        title="Money & Finance"
        subtitle="Local offline ledger"
        right={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate(Routes.AddTransaction)}
            style={[styles.headerAddBtn, { backgroundColor: theme.colors.accent }]}
          >
            <Icon name="add" size={20} color={theme.colors.onAccent} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent}
            colors={[theme.colors.accent]}
          />
        }
      >
        {/* Net Cashflow Overview Card */}
        <Card style={styles.netCard} padding="lg">
          <View style={styles.netHeader}>
            <Text variant="captionStrong" color="textMuted">
              NET CASHFLOW ({periodLabel.toUpperCase()})
            </Text>
            <Badge
              label={isNetPositive ? "Surplus" : "Deficit"}
              tone={isNetPositive ? "success" : "danger"}
            />
          </View>

          <Text
            variant="display"
            color={isNetPositive ? "income" : "expense"}
            style={styles.netAmount}
          >
            {`${isNetPositive ? "+" : "-"}${formatKes(Math.abs(periodNet))}`}
          </Text>

          {/* Period Selector Tabs */}
          <View style={[styles.periodTabs, { backgroundColor: theme.colors.surfaceAlt }]}>
            {(["today", "week", "month", "year"] as Period[]).map((p) => {
              const active = period === p;
              return (
                <TouchableOpacity
                  key={p}
                  activeOpacity={0.7}
                  onPress={() => setPeriod(p)}
                  style={[
                    styles.periodTab,
                    active && {
                      backgroundColor: theme.colors.surface,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                    },
                  ]}
                >
                  <Text
                    variant="captionStrong"
                    color={active ? "text" : "textMuted"}
                    style={{ textTransform: "capitalize" }}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Income & Expense Stat Tiles */}
        <View style={styles.statTilesRow}>
          <View style={styles.statTileCol}>
            <StatTile
              label={`Income (${periodLabel})`}
              value={`+${formatKes(periodIncome)}`}
              icon="arrow-down-circle"
              helperText={`${transactions.filter((t) => t.type === "income").length} credits`}
            />
          </View>
          <View style={styles.statTileCol}>
            <StatTile
              label={`Expenses (${periodLabel})`}
              value={`-${formatKes(periodExpense)}`}
              icon="arrow-up-circle"
              helperText={`${transactions.filter((t) => t.type === "expense").length} debits`}
            />
          </View>
        </View>

        {/* Quick Actions Row */}
        <View style={styles.actionRow}>
          <Button
            label="Add"
            variant="primary"
            icon={<Icon name="add" size={16} color={theme.colors.onAccent} />}
            onPress={() => navigation.navigate(Routes.AddTransaction)}
            style={{ flex: 1 }}
          />
          <Button
            label="Ledger"
            variant="secondary"
            icon={<Icon name="list" size={16} color={theme.colors.text} />}
            onPress={() => navigation.navigate(Routes.TransactionsList)}
            style={{ flex: 1 }}
          />
          <Button
            label="Receipts"
            variant="secondary"
            icon={<Icon name="receipt-outline" size={16} color={theme.colors.text} />}
            onPress={() => navigation.navigate(Routes.ReceiptsList)}
            style={{ flex: 1 }}
          />
          <Button
            label="Lists"
            variant="secondary"
            icon={<Icon name="cart-outline" size={16} color={theme.colors.text} />}
            onPress={() => navigation.navigate(Routes.ShoppingLists)}
            style={{ flex: 1 }}
          />
        </View>

        {/* 7-Day Cashflow Chart */}
        <Card style={styles.sectionCard} padding="md">
          <View style={styles.cardHeader}>
            <Text variant="h3">Weekly Cashflow</Text>
            <Text variant="caption" color="textMuted">
              Last 7 Days
            </Text>
          </View>
          <CashflowChart data={summary.cashflowData} height={160} />
        </Card>

        {/* Expense Category Breakdown */}
        <Card style={styles.sectionCard} padding="md">
          <View style={styles.cardHeader}>
            <Text variant="h3">Expense Breakdown</Text>
            <Text variant="caption" color="textMuted">
              By Category
            </Text>
          </View>
          <CategoryBreakdown
            items={summary.categoryBreakdown}
            totalExpenseMinor={summary.monthExpense}
          />
        </Card>

        {/* Recent Transactions List */}
        <Card style={styles.sectionCard} padding="md">
          <View style={styles.cardHeader}>
            <Text variant="h3">Recent Transactions</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(Routes.TransactionsList)}
            >
              <Text variant="captionStrong" color="accent">
                See all ({transactions.length})
              </Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyRecent}>
              <Text variant="body" color="textMuted">
                No transactions recorded yet.
              </Text>
            </View>
          ) : (
            <View style={styles.txList}>
              {recentTransactions.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  transaction={tx}
                  category={getCategoryById(tx.category_id ?? "")}
                  onPress={() =>
                    navigation.navigate(Routes.TransactionDetail, { id: tx.id })
                  }
                />
              ))}
            </View>
          )}
        </Card>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  headerAddBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  netCard: {
    borderRadius: 16,
  },
  netHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  netAmount: {
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 16,
    fontWeight: "700",
  },
  periodTabs: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  statTilesRow: {
    flexDirection: "row",
    gap: 12,
  },
  statTileCol: {
    flex: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  sectionCard: {
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  txList: {
    marginTop: 4,
  },
  emptyRecent: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FinanceDashboardScreen;
