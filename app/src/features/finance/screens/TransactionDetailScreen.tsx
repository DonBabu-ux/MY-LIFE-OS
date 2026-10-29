import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useRoute, useNavigation, type RouteProp } from "@react-navigation/native";
import { useTheme } from "@design";
import {
  Screen,
  Header,
  Card,
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
import { useFinanceStore } from "../state/financeSlice";
import { TransactionType } from "@shared/enums";
import { CategoryPicker } from "../components/CategoryPicker";

type TransactionDetailRouteProp = RouteProp<MoneyStackParamList, "TransactionDetail">;

export const TransactionDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<TransactionDetailRouteProp>();
  const { show: showToast } = useToast();

  const txId = route.params?.id;

  const transaction = useFinanceStore((state) => state.getTransactionById(txId));
  const categories = useFinanceStore((state) => state.categories);
  const getCategoryById = useFinanceStore((state) => state.getCategoryById);
  const updateTransaction = useFinanceStore((state) => state.updateTransaction);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editMerchant, setEditMerchant] = useState(transaction?.merchant ?? "");
  const [editDescription, setEditDescription] = useState(transaction?.description ?? "");
  const [editAmountStr, setEditAmountStr] = useState(
    transaction ? (transaction.amount_minor / 100).toString() : ""
  );
  const [editCategoryId, setEditCategoryId] = useState(transaction?.category_id ?? null);

  if (!transaction) {
    return (
      <Screen style={styles.container}>
        <Header title="Transaction" showBack />
        <EmptyState
          icon={<Icon name="alert-circle-outline" size={48} color={theme.colors.danger} />}
          title="Transaction Not Found"
          description="The requested transaction might have been deleted or does not exist."
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

  const category = getCategoryById(transaction.category_id ?? "");
  const isIncome = transaction.type === TransactionType.Income;
  const isTransfer = transaction.type === TransactionType.Transfer;

  const formattedAmount = `${isIncome ? "+" : isTransfer ? "" : "-"}KES ${(
    transaction.amount_minor / 100
  ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const txDate = new Date(transaction.occurred_at);
  const formattedFullDate = txDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = txDate.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDelete = () => {
    setShowDeleteDialog(false);
    deleteTransaction(transaction.id);
    showToast("Transaction deleted successfully", "success");
    navigation.goBack();
  };

  const handleSaveEdit = () => {
    const parsedAmount = parseFloat(editAmountStr);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast("Please enter a valid amount", "danger");
      return;
    }

    updateTransaction(transaction.id, {
      merchant: editMerchant.trim() || null,
      description: editDescription.trim() || null,
      amount_minor: Math.round(parsedAmount * 100),
      category_id: editCategoryId,
    });

    setIsEditing(false);
    showToast("Transaction updated", "success");
  };

  return (
    <Screen style={styles.container}>
      <Header
        title="Transaction Details"
        showBack
        right={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowDeleteDialog(true)}
            style={styles.headerDeleteBtn}
          >
            <Icon name="trash-outline" size={20} color={theme.colors.danger} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Amount Card */}
        <Card style={styles.heroCard} padding="lg">
          <View
            style={[
              styles.categoryIconCircle,
              {
                backgroundColor: `${category?.color || theme.colors.accent}20`,
              },
            ]}
          >
            <Icon
              name={category?.icon || (isIncome ? "arrow-down" : "arrow-up")}
              size={32}
              color={category?.color || theme.colors.accent}
            />
          </View>

          <Text
            variant="display"
            color={isIncome ? "income" : isTransfer ? "text" : "text"}
            style={styles.heroAmount}
          >
            {formattedAmount}
          </Text>

          <Text variant="h3" color="text" align="center" style={styles.heroMerchant}>
            {transaction.merchant || category?.name || "Transaction"}
          </Text>

          {/* Badges */}
          <View style={styles.badgesRow}>
            <Badge
              label={
                isIncome ? "Income" : isTransfer ? "Transfer" : "Expense"
              }
              tone={isIncome ? "success" : "neutral"}
            />
            <Badge
              label={`Source: ${transaction.source.toUpperCase()}`}
              tone="neutral"
            />
            <Badge label="Local Only" tone="neutral" />
          </View>
        </Card>

        {/* Detailed Metadata Card */}
        <Card style={styles.detailsCard} padding="md">
          <Text variant="captionStrong" color="textMuted" style={styles.sectionTitle}>
            DETAILS
          </Text>

          {/* Category */}
          <View style={styles.detailRow}>
            <Text variant="body" color="textMuted" style={styles.detailLabel}>
              Category
            </Text>
            <View style={styles.categoryBadgeRow}>
              {category && (
                <View
                  style={[
                    styles.miniCategoryDot,
                    { backgroundColor: category.color ?? theme.colors.accent },
                  ]}
                />
              )}
              <Text variant="bodyStrong">
                {category?.name || "Uncategorized"}
              </Text>
            </View>
          </View>

          <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

          {/* Date & Time */}
          <View style={styles.detailRow}>
            <Text variant="body" color="textMuted" style={styles.detailLabel}>
              Date & Time
            </Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text variant="bodyStrong">{formattedFullDate}</Text>
              <Text variant="caption" color="textMuted">{formattedTime}</Text>
            </View>
          </View>

          <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

          {/* Merchant / Payee */}
          <View style={styles.detailRow}>
            <Text variant="body" color="textMuted" style={styles.detailLabel}>
              Merchant / Payee
            </Text>
            <Text variant="bodyStrong">
              {transaction.merchant || "Not specified"}
            </Text>
          </View>

          {/* Reference code */}
          {transaction.reference && (
            <>
              <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />
              <View style={styles.detailRow}>
                <Text variant="body" color="textMuted" style={styles.detailLabel}>
                  Reference
                </Text>
                <View style={styles.referenceContainer}>
                  <Text variant="bodyStrong" style={styles.referenceText}>
                    {transaction.reference}
                  </Text>
                </View>
              </View>
            </>
          )}

          {/* Description */}
          {transaction.description && (
            <>
              <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />
              <View style={styles.descriptionRow}>
                <Text variant="body" color="textMuted" style={styles.detailLabel}>
                  Note
                </Text>
                <Text variant="body" color="text" style={styles.descriptionText}>
                  {transaction.description}
                </Text>
              </View>
            </>
          )}
        </Card>

        {/* Linked Receipt Section */}
        <Card style={styles.receiptCard} padding="md">
          <View style={styles.receiptHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Icon name="document-text-outline" size={20} color={theme.colors.accent} />
              <Text variant="h3">Linked Receipt</Text>
            </View>
            {transaction.receipt_id && (
              <Badge label="Attached" tone="success" />
            )}
          </View>

          {transaction.receipt_id ? (
            <View style={styles.receiptAttachedBox}>
              <View>
                <Text variant="bodyStrong">Receipt #{transaction.receipt_id}</Text>
                <Text variant="caption" color="textMuted">
                  Offline digital receipt matched
                </Text>
              </View>
              <Button
                label="View Receipt"
                variant="secondary"
                size="sm"
                onPress={() =>
                  navigation.navigate(Routes.ReceiptDetail, {
                    id: transaction.receipt_id!,
                  })
                }
              />
            </View>
          ) : (
            <View style={styles.noReceiptBox}>
              <Text variant="caption" color="textMuted">
                No physical receipt linked to this transaction.
              </Text>
              <Button
                label="Attach Receipt"
                variant="ghost"
                size="sm"
                onPress={() => navigation.navigate(Routes.ReceiptImport)}
              />
            </View>
          )}
        </Card>

        {/* Actions */}
        <View style={styles.bottomActions}>
          <Button
            label="Edit Transaction"
            variant="secondary"
            icon={<Icon name="create-outline" size={16} color={theme.colors.text} />}
            onPress={() => {
              setEditMerchant(transaction.merchant ?? "");
              setEditDescription(transaction.description ?? "");
              setEditAmountStr((transaction.amount_minor / 100).toString());
              setEditCategoryId(transaction.category_id ?? null);
              setIsEditing(true);
            }}
            fullWidth
          />
          <Button
            label="Delete Transaction"
            variant="danger"
            icon={<Icon name="trash-outline" size={16} color={theme.colors.danger} />}
            onPress={() => setShowDeleteDialog(true)}
            fullWidth
          />
        </View>
      </ScrollView>

      {/* Delete Confirmation Dialog */}
      <Dialog
        visible={showDeleteDialog}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action is permanent and cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

      {/* Quick Edit Modal */}
      <Modal
        visible={isEditing}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <View style={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text variant="h3">Edit Transaction</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Icon name="close" size={24} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text variant="captionStrong" color="textMuted">
                Amount (KES)
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
                value={editAmountStr}
                onChangeText={setEditAmountStr}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textSubtle}
              />

              <Text variant="captionStrong" color="textMuted" style={{ marginTop: 12 }}>
                Merchant / Payee
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
                value={editMerchant}
                onChangeText={setEditMerchant}
                placeholder="Merchant name"
                placeholderTextColor={theme.colors.textSubtle}
              />

              <Text variant="captionStrong" color="textMuted" style={{ marginTop: 12 }}>
                Note / Description
              </Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.surfaceAlt,
                    height: 70,
                    textAlignVertical: "top",
                  },
                ]}
                multiline
                value={editDescription}
                onChangeText={setEditDescription}
                placeholder="Notes..."
                placeholderTextColor={theme.colors.textSubtle}
              />

              <Text variant="captionStrong" color="textMuted" style={{ marginTop: 12 }}>
                Category
              </Text>
              <CategoryPicker
                categories={categories}
                selectedCategoryId={editCategoryId}
                onSelectCategory={(cat) => setEditCategoryId(cat.id)}
              />

              <View style={styles.modalButtonsRow}>
                <Button
                  label="Cancel"
                  variant="ghost"
                  onPress={() => setIsEditing(false)}
                  style={{ flex: 1 }}
                />
                <Button
                  label="Save Changes"
                  variant="primary"
                  onPress={handleSaveEdit}
                  style={{ flex: 1 }}
                />
              </View>
            </ScrollView>
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
  headerDeleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  heroCard: {
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 24,
  },
  categoryIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heroAmount: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
    marginBottom: 4,
  },
  heroMerchant: {
    marginBottom: 16,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
  },
  detailsCard: {
    borderRadius: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  detailLabel: {
    flex: 1,
  },
  categoryBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  miniCategoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  referenceContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  referenceText: {
    fontFamily: "monospace",
  },
  descriptionRow: {
    paddingVertical: 10,
    gap: 4,
  },
  descriptionText: {
    marginTop: 2,
  },
  receiptCard: {
    borderRadius: 16,
  },
  receiptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  receiptAttachedBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 6,
  },
  noReceiptBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 6,
  },
  bottomActions: {
    gap: 12,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalContent: {
    gap: 8,
    paddingBottom: 24,
  },
  modalInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 15,
    marginTop: 4,
  },
  modalButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
});

export default TransactionDetailScreen;
