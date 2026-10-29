import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation, type RouteProp } from "@react-navigation/native";
import { useTheme } from "@design";
import {
  Screen,
  Header,
  Text,
  Badge,
  Button,
  Icon,
  Dialog,
  useToast,
  EmptyState,
} from "../../../components";
import type { MoneyStackParamList } from "../../../navigation/types";
import { Routes } from "../../../navigation/routes";
import { useShoppingStore } from "../state/shoppingSlice";
import { BudgetBar } from "../components/BudgetBar";
import { AddItemSheet } from "../components/AddItemSheet";
import { LinkToTransactionSheet } from "../components/LinkToTransactionSheet";
import { ShoppingItemRow } from "../components/ShoppingItemRow";
import type { ShoppingItem } from "@shared/entities";
import { ShoppingListStatus } from "@shared/enums";

type ListDetailRouteProp = RouteProp<MoneyStackParamList, "ShoppingListDetail">;

export const ListDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<ListDetailRouteProp>();
  const { show: showToast } = useToast();

  const listId = route.params?.id;

  const list = useShoppingStore((state) => state.getListById(listId));
  const getItemsByListId = useShoppingStore((state) => state.getItemsByListId);
  const getListStats = useShoppingStore((state) => state.getListStats);
  const addItem = useShoppingStore((state) => state.addItem);
  const deleteItem = useShoppingStore((state) => state.deleteItem);
  const togglePurchased = useShoppingStore((state) => state.togglePurchased);
  const updateItemQty = useShoppingStore((state) => state.updateItemQty);
  const linkItemToTransaction = useShoppingStore((state) => state.linkItemToTransaction);
  const updateList = useShoppingStore((state) => state.updateList);
  const deleteList = useShoppingStore((state) => state.deleteList);

  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showLinkSheet, setShowLinkSheet] = useState(false);
  const [selectedItemForLink, setSelectedItemForLink] = useState<ShoppingItem | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "pending" | "purchased">("all");

  if (!list) {
    return (
      <Screen style={styles.container}>
        <Header title="Shopping List" showBack />
        <EmptyState
          icon={<Icon name="cart-outline" size={48} color={theme.colors.danger} />}
          title="List Not Found"
          description="The requested shopping list could not be found or has been removed."
          action={
            <Button
              label="Go Back"
              variant="secondary"
              onPress={() => navigation.goBack()}
            />
          }
        />
      </Screen>
    );
  }

  const items = getItemsByListId(list.id);
  const stats = getListStats(list.id);

  const filteredItems = items.filter((it) => {
    if (filterMode === "pending") return !it.purchased;
    if (filterMode === "purchased") return it.purchased;
    return true;
  });

  const pendingItems = filteredItems.filter((i) => !i.purchased);
  const purchasedItems = filteredItems.filter((i) => i.purchased);

  const handleToggleCompleteList = () => {
    const nextStatus =
      list.status === ShoppingListStatus.Done
        ? ShoppingListStatus.Open
        : ShoppingListStatus.Done;
    updateList(list.id, { status: nextStatus });
    showToast(
      nextStatus === ShoppingListStatus.Done ? "List marked complete!" : "List reopened",
      "success"
    );
  };

  const handleDeleteList = () => {
    setShowDeleteDialog(false);
    deleteList(list.id);
    showToast("Shopping list deleted", "success");
    navigation.goBack();
  };

  const handleAddItem = (data: {
    name: string;
    quantity: number;
    unit: string;
    estimated_price_minor?: number;
    priority: number;
  }) => {
    addItem({
      list_id: list.id,
      name: data.name,
      quantity: data.quantity,
      unit: data.unit,
      priority: data.priority,
      estimated_price_minor: data.estimated_price_minor,
    });
    showToast("Item added to list", "success");
  };

  const handleSelectTransaction = (tx: any) => {
    if (!selectedItemForLink) return;
    linkItemToTransaction(selectedItemForLink.id, tx.id, tx.amount_minor);
    setShowLinkSheet(false);
    setSelectedItemForLink(null);
    showToast(`Linked ${selectedItemForLink.name} to transaction`, "success");
  };

  return (
    <Screen style={styles.container}>
      <Header
        title={list.name}
        subtitle={`${stats.purchasedCount} of ${stats.itemCount} items purchased`}
        showBack
        right={
          <View style={styles.headerRight}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleToggleCompleteList}
              style={[
                styles.iconBtn,
                {
                  backgroundColor:
                    list.status === ShoppingListStatus.Done
                      ? theme.colors.success
                      : theme.colors.surfaceAlt,
                },
              ]}
            >
              <Icon
                name="checkmark-circle-outline"
                size={20}
                color={
                  list.status === ShoppingListStatus.Done
                    ? theme.colors.onAccent
                    : theme.colors.text
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowDeleteDialog(true)}
              style={[styles.iconBtn, { backgroundColor: theme.colors.surfaceAlt }]}
            >
              <Icon name="trash-outline" size={18} color={theme.colors.danger} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Live Budget Bar */}
        {list.budget_minor && list.budget_minor > 0 && (
          <BudgetBar
            estimatedTotalMinor={stats.totalEstimatedMinor}
            actualTotalMinor={stats.totalActualMinor}
            budgetMinor={stats.budgetMinor}
          />
        )}

        {/* Filter Tabs */}
        <View style={[styles.filterTabs, { backgroundColor: theme.colors.surfaceAlt }]}>
          {(["all", "pending", "purchased"] as const).map((mode) => {
            const active = filterMode === mode;
            const label =
              mode === "all"
                ? `All (${items.length})`
                : mode === "pending"
                ? `To Buy (${items.filter((i) => !i.purchased).length})`
                : `Bought (${items.filter((i) => i.purchased).length})`;

            return (
              <TouchableOpacity
                key={mode}
                activeOpacity={0.7}
                onPress={() => setFilterMode(mode)}
                style={[
                  styles.filterTab,
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
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Items Listing */}
        {items.length === 0 ? (
          <EmptyState
            icon={<Icon name="cart-outline" size={44} color={theme.colors.textMuted} />}
            title="Empty Shopping List"
            description="Add items with quantities and estimated prices to track your cart."
            action={
              <Button
                label="Add First Item"
                variant="primary"
                onPress={() => setShowAddSheet(true)}
              />
            }
          />
        ) : (
          <View style={styles.itemsWrapper}>
            {/* Pending items section */}
            {pendingItems.length > 0 && (
              <View style={styles.sectionBlock}>
                {filterMode === "all" && (
                  <Text variant="captionStrong" color="textMuted" style={styles.sectionHeader}>
                    TO BUY ({pendingItems.length})
                  </Text>
                )}
                {pendingItems.map((it) => (
                  <ShoppingItemRow
                    key={it.id}
                    item={it}
                    onTogglePurchased={() => togglePurchased(it.id)}
                    onIncrementQty={() => updateItemQty(it.id, 1)}
                    onDecrementQty={() => updateItemQty(it.id, -1)}
                    onLinkTransaction={() => {
                      setSelectedItemForLink(it);
                      setShowLinkSheet(true);
                    }}
                    onViewPriceHistory={() =>
                      navigation.navigate(Routes.PriceHistory, {
                        itemKey: it.name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
                        itemName: it.name,
                      })
                    }
                    onDelete={() => deleteItem(it.id)}
                  />
                ))}
              </View>
            )}

            {/* Purchased items section */}
            {purchasedItems.length > 0 && (
              <View style={styles.sectionBlock}>
                {filterMode === "all" && (
                  <Text variant="captionStrong" color="textMuted" style={styles.sectionHeader}>
                    PURCHASED ({purchasedItems.length})
                  </Text>
                )}
                {purchasedItems.map((it) => (
                  <ShoppingItemRow
                    key={it.id}
                    item={it}
                    onTogglePurchased={() => togglePurchased(it.id)}
                    onIncrementQty={() => updateItemQty(it.id, 1)}
                    onDecrementQty={() => updateItemQty(it.id, -1)}
                    onLinkTransaction={() => {
                      setSelectedItemForLink(it);
                      setShowLinkSheet(true);
                    }}
                    onViewPriceHistory={() =>
                      navigation.navigate(Routes.PriceHistory, {
                        itemKey: it.name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
                        itemName: it.name,
                      })
                    }
                    onDelete={() => deleteItem(it.id)}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Floating Add Item Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShowAddSheet(true)}
        style={[styles.fab, { backgroundColor: theme.colors.accent }]}
      >
        <Icon name="add" size={28} color={theme.colors.onAccent} />
      </TouchableOpacity>

      {/* Add Item Sheet */}
      <AddItemSheet
        visible={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onAdd={handleAddItem}
      />

      {/* Link to Transaction Sheet */}
      <LinkToTransactionSheet
        visible={showLinkSheet}
        item={selectedItemForLink}
        onClose={() => {
          setShowLinkSheet(false);
          setSelectedItemForLink(null);
        }}
        onSelectTransaction={handleSelectTransaction}
      />

      {/* Delete List Dialog */}
      <Dialog
        visible={showDeleteDialog}
        title="Delete Shopping List"
        message="Are you sure you want to delete this shopping list and all its items? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleDeleteList}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
    gap: 14,
  },
  filterTabs: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  itemsWrapper: {
    gap: 16,
  },
  sectionBlock: {
    gap: 4,
  },
  sectionHeader: {
    marginBottom: 6,
    paddingHorizontal: 4,
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

export default ListDetailScreen;
