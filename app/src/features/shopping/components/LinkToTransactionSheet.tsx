import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import { useTheme } from "@design";
import { Text, Icon, Badge } from "../../../components";
import { useFinanceStore } from "../../finance/state/financeSlice";
import type { ShoppingItem, Transaction } from "@shared/entities";
import { TransactionType } from "@shared/enums";

export type LinkToTransactionSheetProps = {
  visible: boolean;
  item: ShoppingItem | null;
  onClose: () => void;
  onSelectTransaction: (transaction: Transaction) => void;
};

export const LinkToTransactionSheet: React.FC<LinkToTransactionSheetProps> = ({
  visible,
  item,
  onClose,
  onSelectTransaction,
}) => {
  const theme = useTheme();

  const transactions = useFinanceStore((state) => state.transactions);
  const [search, setSearch] = useState("");

  const filteredTransactions = transactions.filter((tx) => {
    if (tx.type !== TransactionType.Expense) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const merchantMatch = tx.merchant?.toLowerCase().includes(q) ?? false;
    const descMatch = tx.description?.toLowerCase().includes(q) ?? false;
    return merchantMatch || descMatch;
  });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
        <View style={[styles.sheetContainer, { backgroundColor: theme.colors.surface }]}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text variant="h3">Link to Transaction</Text>
              {item && (
                <Text variant="caption" color="textMuted">
                  Item: {item.name}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon name="close" size={22} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <View style={[styles.searchBar, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceAlt }]}>
            <Icon name="search" size={16} color={theme.colors.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search expenses..."
              placeholderTextColor={theme.colors.textSubtle}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Transaction options list */}
          <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            {filteredTransactions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text variant="caption" color="textMuted">
                  No matching expense transactions found.
                </Text>
              </View>
            ) : (
              filteredTransactions.map((tx) => {
                const formattedAmount = `KES ${(tx.amount_minor / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}`;
                const formattedDate = new Date(tx.occurred_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <TouchableOpacity
                    key={tx.id}
                    activeOpacity={0.7}
                    onPress={() => onSelectTransaction(tx)}
                    style={[
                      styles.txRow,
                      {
                        backgroundColor: theme.colors.surfaceAlt,
                        borderColor: theme.colors.border,
                      },
                    ]}
                  >
                    <View style={styles.txIconBox}>
                      <Icon name="cash-outline" size={18} color={theme.colors.accent} />
                    </View>

                    <View style={styles.txDetails}>
                      <Text variant="bodyStrong" color="text" numberOfLines={1}>
                        {tx.merchant || "Transaction"}
                      </Text>
                      <Text variant="caption" color="textMuted">
                        {`${formattedDate} · ${tx.description || tx.source}`}
                      </Text>
                    </View>

                    <View style={styles.txAmountCol}>
                      <Text variant="bodyStrong" color="expense">
                        {`-${formattedAmount}`}
                      </Text>
                      <Badge label="Pick" tone="accent" style={{ marginTop: 2 }} />
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "80%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  closeBtn: {
    padding: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
  },
  listContent: {
    gap: 8,
    paddingBottom: 20,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: "center",
  },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  txIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  txDetails: {
    flex: 1,
    marginRight: 8,
  },
  txAmountCol: {
    alignItems: "flex-end",
  },
});

export default LinkToTransactionSheet;
