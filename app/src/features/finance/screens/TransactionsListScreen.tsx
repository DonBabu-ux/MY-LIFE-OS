import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@design";
import {
  Screen,
  Header,
  Card,
  Text,
  Chip,
  Icon,
  EmptyState,
  Button,
} from "../../../components";
import { Routes } from "../../../navigation/routes";
import { useFinanceStore } from "../state/financeSlice";
import { TransactionRow } from "../components/TransactionRow";
import { TransactionType } from "@shared/enums";
import type { Transaction } from "@shared/entities";

export const TransactionsListScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const [refreshing, setRefreshing] = useState(false);

  const transactions = useFinanceStore((state) => state.transactions);
  const categories = useFinanceStore((state) => state.categories);
  const filter = useFinanceStore((state) => state.filter);
  const setFilter = useFinanceStore((state) => state.setFilter);
  const resetFilter = useFinanceStore((state) => state.resetFilter);
  const getCategoryById = useFinanceStore((state) => state.getCategoryById);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }, []);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (filter.type !== "all" && tx.type !== filter.type) {
        return false;
      }
      // Category filter
      if (filter.categoryId && tx.category_id !== filter.categoryId) {
        return false;
      }
      // Search filter
      if (filter.search.trim()) {
        const query = filter.search.toLowerCase().trim();
        const catName = categories.find((c) => c.id === tx.category_id)?.name.toLowerCase() ?? "";
        const merchantMatch = tx.merchant?.toLowerCase().includes(query) ?? false;
        const descMatch = tx.description?.toLowerCase().includes(query) ?? false;
        const refMatch = tx.reference?.toLowerCase().includes(query) ?? false;
        const catMatch = catName.includes(query);

        return merchantMatch || descMatch || refMatch || catMatch;
      }
      return true;
    });
  }, [transactions, filter, categories]);

  // Group by date
  const groupedTransactions = useMemo(() => {
    const groups: { [dateKey: string]: { label: string; items: Transaction[]; netMinor: number } } = {};
    const now = new Date();
    const todayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toDateString();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    for (const tx of filteredTransactions) {
      const txDate = new Date(tx.occurred_at);
      const dayStartStr = new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate()).toDateString();

      let label = "";
      if (dayStartStr === todayStr) {
        label = "Today";
      } else if (dayStartStr === yesterdayStr) {
        label = "Yesterday";
      } else {
        label = txDate.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }

      if (!groups[dayStartStr]) {
        groups[dayStartStr] = { label, items: [], netMinor: 0 };
      }
      groups[dayStartStr].items.push(tx);
      if (tx.type === TransactionType.Income) {
        groups[dayStartStr].netMinor += tx.amount_minor;
      } else if (tx.type === TransactionType.Expense) {
        groups[dayStartStr].netMinor -= tx.amount_minor;
      }
    }

    return Object.values(groups);
  }, [filteredTransactions]);

  const typeFilters: Array<{ label: string; value: TransactionType | "all" }> = [
    { label: "All", value: "all" },
    { label: "Expenses", value: TransactionType.Expense },
    { label: "Income", value: TransactionType.Income },
    { label: "Transfers", value: TransactionType.Transfer },
  ];

  return (
    <Screen style={styles.container}>
      <Header
        title="Transactions"
        subtitle={`${filteredTransactions.length} items`}
        showBack
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

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Icon name="search" size={18} color={theme.colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search merchant, notes, reference..."
            placeholderTextColor={theme.colors.textSubtle}
            value={filter.search}
            onChangeText={(text) => setFilter({ search: text })}
            clearButtonMode="while-editing"
          />
          {filter.search.length > 0 && (
            <TouchableOpacity onPress={() => setFilter({ search: "" })}>
              <Icon name="close-circle" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Chips: Type */}
      <View style={styles.typeChipsRow}>
        {typeFilters.map((t) => (
          <Chip
            key={t.value}
            label={t.label}
            selected={filter.type === t.value}
            onPress={() => setFilter({ type: t.value })}
          />
        ))}
      </View>

      {/* Category Filter Chips: Horizontal Scroll */}
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setFilter({ categoryId: undefined })}
            style={[
              styles.catChip,
              {
                backgroundColor: !filter.categoryId
                  ? theme.colors.accentSubtle
                  : theme.colors.surface,
                borderColor: !filter.categoryId
                  ? theme.colors.accent
                  : theme.colors.border,
              },
            ]}
          >
            <Text
              variant="captionStrong"
              color={!filter.categoryId ? "accent" : "textMuted"}
            >
              All Categories
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const isSelected = filter.categoryId === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.7}
                onPress={() =>
                  setFilter({
                    categoryId: isSelected ? undefined : cat.id,
                  })
                }
                style={[
                  styles.catChip,
                  {
                    backgroundColor: isSelected
                      ? `${cat.color || theme.colors.accent}25`
                      : theme.colors.surface,
                    borderColor: isSelected
                      ? cat.color || theme.colors.accent
                      : theme.colors.border,
                  },
                ]}
              >
                {cat.icon && (
                  <Icon
                    name={cat.icon}
                    size={14}
                    color={
                      isSelected
                        ? cat.color || theme.colors.accent
                        : theme.colors.textMuted
                    }
                    style={{ marginRight: 5 }}
                  />
                )}
                <Text
                  variant="captionStrong"
                  color={isSelected ? "text" : "textMuted"}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Transactions List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
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
        {groupedTransactions.length === 0 ? (
          <EmptyState
            icon={<Icon name="receipt-outline" size={48} color={theme.colors.textMuted} />}
            title="No Transactions Found"
            description={
              filter.search || filter.type !== "all" || filter.categoryId
                ? "Try clearing your filters or changing search keywords."
                : "Record your first transaction to start tracking your local finances."
            }
            action={
              filter.search || filter.type !== "all" || filter.categoryId ? (
                <Button label="Clear Filters" variant="secondary" onPress={resetFilter} />
              ) : (
                <Button
                  label="Add Transaction"
                  variant="primary"
                  onPress={() => navigation.navigate(Routes.AddTransaction)}
                />
              )
            }
          />
        ) : (
          groupedTransactions.map((group) => {
            const isPositive = group.netMinor >= 0;
            return (
              <View key={group.label} style={styles.groupContainer}>
                {/* Group Header */}
                <View style={styles.groupHeader}>
                  <Text variant="captionStrong" color="textMuted">
                    {group.label.toUpperCase()}
                  </Text>
                  <Text
                    variant="captionStrong"
                    color={isPositive ? "income" : "expense"}
                  >
                    {`${isPositive ? "+" : "-"}KES ${(
                      Math.abs(group.netMinor) / 100
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}`}
                  </Text>
                </View>

                {/* Group Items in Card */}
                <Card padding="md" style={styles.groupCard}>
                  {group.items.map((tx, idx) => (
                    <React.Fragment key={tx.id}>
                      <TransactionRow
                        transaction={tx}
                        category={getCategoryById(tx.category_id ?? "")}
                        onPress={() =>
                          navigation.navigate(Routes.TransactionDetail, { id: tx.id })
                        }
                      />
                      {idx < group.items.length - 1 && (
                        <View
                          style={[
                            styles.rowSeparator,
                            { backgroundColor: theme.colors.border },
                          ]}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </Card>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate(Routes.AddTransaction)}
        style={[styles.fab, { backgroundColor: theme.colors.accent }]}
      >
        <Icon name="add" size={28} color={theme.colors.onAccent} />
      </TouchableOpacity>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerAddBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
  },
  typeChipsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },
  categoriesSection: {
    paddingBottom: 6,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 18,
    borderWidth: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
    gap: 16,
  },
  groupContainer: {
    gap: 6,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  groupCard: {
    borderRadius: 16,
  },
  rowSeparator: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 2,
    marginLeft: 54, // Align past the category icon
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default TransactionsListScreen;
