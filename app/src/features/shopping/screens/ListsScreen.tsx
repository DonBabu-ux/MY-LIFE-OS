import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@design";
import {
  Screen,
  Header,
  Card,
  Text,
  Badge,
  Chip,
  Button,
  Icon,
  EmptyState,
  useToast,
} from "../../../components";
import { Routes } from "../../../navigation/routes";
import { useShoppingStore } from "../state/shoppingSlice";
import { ShoppingListStatus } from "@shared/enums";

export const ListsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { show: showToast } = useToast();

  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListBudget, setNewListBudget] = useState("");

  const lists = useShoppingStore((state) => state.lists);
  const filterStatus = useShoppingStore((state) => state.filterStatus);
  const setFilterStatus = useShoppingStore((state) => state.setFilterStatus);
  const createList = useShoppingStore((state) => state.createList);
  const getListStats = useShoppingStore((state) => state.getListStats);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }, []);

  const filteredLists = lists.filter((l) => {
    if (filterStatus === "all") return true;
    return l.status === filterStatus;
  });

  const handleCreateList = () => {
    if (!newListName.trim()) {
      showToast("Please enter a list name", "danger");
      return;
    }

    const budgetParsed = parseFloat(newListBudget);
    const budget_minor = !isNaN(budgetParsed) && budgetParsed > 0
      ? Math.round(budgetParsed * 100)
      : null;

    const created = createList({
      name: newListName.trim(),
      budget_minor,
      currency: "KES",
    });

    setNewListName("");
    setNewListBudget("");
    setShowCreateModal(false);
    showToast("Shopping list created", "success");
    navigation.navigate(Routes.ShoppingListDetail, { id: created.id });
  };

  const statusChips = [
    { label: "All Lists", value: "all" as const },
    { label: "Open", value: ShoppingListStatus.Open },
    { label: "Completed", value: ShoppingListStatus.Done },
    { label: "Archived", value: ShoppingListStatus.Archived },
  ];

  return (
    <Screen style={styles.container}>
      <Header
        title="Shopping Lists"
        subtitle={`${lists.length} lists total`}
        showBack
        right={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowCreateModal(true)}
            style={[styles.headerAddBtn, { backgroundColor: theme.colors.accent }]}
          >
            <Icon name="add" size={20} color={theme.colors.onAccent} />
          </TouchableOpacity>
        }
      />

      {/* Filter Chips */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {statusChips.map((s) => (
            <Chip
              key={s.value}
              label={s.label}
              selected={filterStatus === s.value}
              onPress={() => setFilterStatus(s.value)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Lists ScrollView */}
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
        {filteredLists.length === 0 ? (
          <EmptyState
            icon={<Icon name="cart-outline" size={48} color={theme.colors.textMuted} />}
            title="No Shopping Lists"
            description={
              filterStatus !== "all"
                ? "No lists found with this status filter."
                : "Create a planned shopping list with budgets and checklist items."
            }
            action={
              <Button
                label="Create Shopping List"
                variant="primary"
                onPress={() => setShowCreateModal(true)}
              />
            }
          />
        ) : (
          filteredLists.map((l) => {
            const stats = getListStats(l.id);
            const isCompleted = l.status === ShoppingListStatus.Done;
            const formattedBudget = l.budget_minor
              ? `KES ${(l.budget_minor / 100).toLocaleString()}`
              : "No budget limit";

            return (
              <TouchableOpacity
                key={l.id}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate(Routes.ShoppingListDetail, { id: l.id })
                }
              >
                <Card style={styles.listCard} padding="md">
                  <View style={styles.cardTopRow}>
                    <View style={{ flex: 1 }}>
                      <Text variant="h3" color="text" numberOfLines={1}>
                        {l.name}
                      </Text>
                      <Text variant="caption" color="textMuted">
                        {`Budget: ${formattedBudget}`}
                      </Text>
                    </View>

                    <Badge
                      label={
                        isCompleted
                          ? "Completed"
                          : l.status === ShoppingListStatus.Archived
                          ? "Archived"
                          : `${stats.purchasedCount}/${stats.itemCount} items`
                      }
                      tone={isCompleted ? "success" : "neutral"}
                    />
                  </View>

                  {/* Mini progress bar if budget is defined */}
                  {l.budget_minor && l.budget_minor > 0 && (
                    <View style={styles.progressContainer}>
                      <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.min(Math.round(stats.percentBudgetUsed * 100), 100)}%`,
                              backgroundColor: stats.isOverBudget
                                ? theme.colors.danger
                                : theme.colors.accent,
                            },
                          ]}
                        />
                      </View>
                      <View style={styles.progressLabels}>
                        <Text variant="caption" color="textMuted">
                          {`Spent: KES ${(stats.totalActualMinor / 100).toLocaleString()}`}
                        </Text>
                        <Text
                          variant="captionStrong"
                          color={stats.isOverBudget ? "danger" : "textMuted"}
                        >
                          {`${Math.round(stats.percentBudgetUsed * 100)}%`}
                        </Text>
                      </View>
                    </View>
                  )}
                </Card>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShowCreateModal(true)}
        style={[styles.fab, { backgroundColor: theme.colors.accent }]}
      >
        <Icon name="add" size={28} color={theme.colors.onAccent} />
      </TouchableOpacity>

      {/* Create List Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent onRequestClose={() => setShowCreateModal(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <View style={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text variant="h3">New Shopping List</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Icon name="close" size={24} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 14, marginVertical: 12 }}>
              <View>
                <Text variant="captionStrong" color="textMuted" style={{ marginBottom: 4 }}>
                  List Name
                </Text>
                <TextInput
                  style={[
                    styles.modalInput,
                    {
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.surfaceAlt,
                    },
                  ]}
                  value={newListName}
                  onChangeText={setNewListName}
                  placeholder="e.g. Monthly Household, Grocery Trip"
                  placeholderTextColor={theme.colors.textSubtle}
                  autoFocus
                />
              </View>

              <View>
                <Text variant="captionStrong" color="textMuted" style={{ marginBottom: 4 }}>
                  Budget (KES, Optional)
                </Text>
                <TextInput
                  style={[
                    styles.modalInput,
                    {
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.surfaceAlt,
                    },
                  ]}
                  keyboardType="numeric"
                  value={newListBudget}
                  onChangeText={setNewListBudget}
                  placeholder="e.g. 5000.00"
                  placeholderTextColor={theme.colors.textSubtle}
                />
              </View>

              <View style={styles.modalBtns}>
                <Button label="Cancel" variant="ghost" onPress={() => setShowCreateModal(false)} style={{ flex: 1 }} />
                <Button label="Create List" variant="primary" onPress={handleCreateList} style={{ flex: 1 }} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  filterSection: {
    paddingVertical: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
    gap: 12,
  },
  listCard: {
    borderRadius: 16,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressContainer: {
    marginTop: 12,
    gap: 4,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  modalBtns: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
});

export default ListsScreen;
