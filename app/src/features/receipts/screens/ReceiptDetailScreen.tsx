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
import { useReceiptsStore } from "../state/receiptsSlice";
import { useFinanceStore } from "../../finance/state/financeSlice";
import { ReceiptImageViewer } from "../components/ReceiptImageViewer";

type ReceiptDetailRouteProp = RouteProp<MoneyStackParamList, "ReceiptDetail">;

export const ReceiptDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<ReceiptDetailRouteProp>();
  const { show: showToast } = useToast();

  const receiptId = route.params?.id;

  const receipt = useReceiptsStore((state) => state.getReceiptById(receiptId));
  const updateReceipt = useReceiptsStore((state) => state.updateReceipt);
  const deleteReceipt = useReceiptsStore((state) => state.deleteReceipt);

  const categories = useFinanceStore((state) => state.categories);
  const transactions = useFinanceStore((state) => state.transactions);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRawOcr, setShowRawOcr] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [editMerchant, setEditMerchant] = useState(receipt?.merchant ?? "");
  const [editAmountStr, setEditAmountStr] = useState(
    receipt?.amount_minor ? (receipt.amount_minor / 100).toString() : ""
  );

  if (!receipt) {
    return (
      <Screen style={styles.container}>
        <Header title="Receipt" showBack />
        <EmptyState
          icon={<Icon name="alert-circle-outline" size={48} color={theme.colors.danger} />}
          title="Receipt Not Found"
          description="The requested receipt record could not be located in local storage."
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

  const category = categories.find((c) => c.id === receipt.category_id);
  const formattedAmount = receipt.amount_minor
    ? `KES ${(receipt.amount_minor / 100).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "KES 0.00";

  // Check for linked transaction (either by receipt_id or same merchant + amount)
  const linkedTransaction = transactions.find(
    (tx) => tx.receipt_id === receipt.id || (tx.merchant === receipt.merchant && tx.amount_minor === receipt.amount_minor)
  );

  const handleDelete = () => {
    setShowDeleteDialog(false);
    deleteReceipt(receipt.id);
    showToast("Receipt deleted from local storage", "success");
    navigation.goBack();
  };

  const handleSaveEdit = () => {
    const parsed = parseFloat(editAmountStr);
    if (isNaN(parsed) || parsed <= 0) {
      showToast("Please enter a valid amount", "danger");
      return;
    }

    updateReceipt(receipt.id, {
      merchant: editMerchant.trim() || receipt.merchant,
      amount_minor: Math.round(parsed * 100),
    });

    setIsEditing(false);
    showToast("Receipt updated", "success");
  };

  return (
    <Screen style={styles.container}>
      <Header
        title={receipt.merchant || "Receipt Details"}
        subtitle={
          receipt.occurred_at
            ? new Date(receipt.occurred_at).toLocaleDateString()
            : undefined
        }
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Interactive Paper Image Viewer */}
        <ReceiptImageViewer receipt={receipt} />

        {/* Extracted Fields Summary Card */}
        <Card style={styles.sectionCard} padding="md">
          <View style={styles.cardHeader}>
            <Text variant="h3">Extracted Details</Text>
            <Badge label={`Source: ${receipt.source}`} tone="neutral" />
          </View>

          {/* Merchant */}
          <View style={styles.fieldRow}>
            <Text variant="body" color="textMuted">Merchant</Text>
            <Text variant="bodyStrong">{receipt.merchant || "Unknown"}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          {/* Amount */}
          <View style={styles.fieldRow}>
            <Text variant="body" color="textMuted">Total Amount</Text>
            <Text variant="h3" color="text">{formattedAmount}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          {/* Category */}
          <View style={styles.fieldRow}>
            <Text variant="body" color="textMuted">Category</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              {category?.color && (
                <View style={[styles.catDot, { backgroundColor: category.color }]} />
              )}
              <Text variant="bodyStrong">{category?.name || "Uncategorized"}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          {/* Date */}
          <View style={styles.fieldRow}>
            <Text variant="body" color="textMuted">Date & Time</Text>
            <Text variant="bodyStrong">
              {receipt.occurred_at ? new Date(receipt.occurred_at).toLocaleString() : "Unknown"}
            </Text>
          </View>
        </Card>

        {/* Extracted Line Items Card */}
        <Card style={styles.sectionCard} padding="md">
          <View style={styles.cardHeader}>
            <Text variant="h3">Line Items ({receipt.items?.length ?? 0})</Text>
            <Icon name="basket-outline" size={18} color={theme.colors.accent} />
          </View>

          {receipt.items && receipt.items.length > 0 ? (
            <View style={styles.itemsTable}>
              <View style={[styles.tableHeaderRow, { borderBottomColor: theme.colors.border }]}>
                <Text variant="captionStrong" color="textMuted" style={{ flex: 1 }}>Item</Text>
                <Text variant="captionStrong" color="textMuted" style={{ width: 40, textAlign: "center" }}>Qty</Text>
                <Text variant="captionStrong" color="textMuted" style={{ width: 80, textAlign: "right" }}>Price</Text>
              </View>

              {receipt.items.map((it) => (
                <View key={it.id} style={styles.tableItemRow}>
                  <Text variant="body" color="text" numberOfLines={1} style={{ flex: 1 }}>
                    {it.name}
                  </Text>
                  <Text variant="body" color="textMuted" style={{ width: 40, textAlign: "center" }}>
                    {it.quantity ?? 1}
                  </Text>
                  <Text variant="bodyStrong" color="text" style={{ width: 80, textAlign: "right" }}>
                    {it.unit_price_minor
                      ? `KES ${((it.unit_price_minor * (it.quantity ?? 1)) / 100).toFixed(2)}`
                      : "-"}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text variant="caption" color="textMuted">No line items parsed from OCR.</Text>
          )}
        </Card>

        {/* Linked Transaction Card */}
        <Card style={styles.sectionCard} padding="md">
          <View style={styles.cardHeader}>
            <Text variant="h3">Linked Transaction</Text>
            {linkedTransaction ? (
              <Badge label="Linked" tone="success" />
            ) : (
              <Badge label="Unlinked" tone="neutral" />
            )}
          </View>

          {linkedTransaction ? (
            <View style={styles.linkedTxBox}>
              <View style={{ flex: 1 }}>
                <Text variant="bodyStrong">{linkedTransaction.merchant}</Text>
                <Text variant="caption" color="textMuted">
                  {`KES ${(linkedTransaction.amount_minor / 100).toFixed(2)} · ${new Date(
                    linkedTransaction.occurred_at
                  ).toLocaleDateString()}`}
                </Text>
              </View>
              <Button
                label="View Transaction"
                variant="secondary"
                size="sm"
                onPress={() =>
                  navigation.navigate(Routes.TransactionDetail, {
                    id: linkedTransaction.id,
                  })
                }
              />
            </View>
          ) : (
            <View style={styles.unlinkedBox}>
              <Text variant="caption" color="textMuted" style={{ flex: 1 }}>
                No ledger entry is currently associated with this receipt slip.
              </Text>
              <Button
                label="Create Entry"
                variant="secondary"
                size="sm"
                onPress={() => navigation.navigate(Routes.AddTransaction)}
              />
            </View>
          )}
        </Card>

        {/* Collapsible Raw OCR Text */}
        <Card style={styles.sectionCard} padding="md">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowRawOcr(!showRawOcr)}
            style={styles.cardHeader}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Icon name="code-working-outline" size={18} color={theme.colors.textMuted} />
              <Text variant="bodyStrong">Raw OCR Text</Text>
            </View>
            <Icon
              name={showRawOcr ? "chevron-up" : "chevron-down"}
              size={18}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>

          {showRawOcr && (
            <View
              style={[
                styles.ocrBox,
                {
                  backgroundColor: theme.colors.surfaceAlt,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text style={styles.ocrText}>{receipt.extracted_text || "No text available"}</Text>
            </View>
          )}
        </Card>

        {/* Actions */}
        <View style={styles.actionButtons}>
          <Button
            label="Edit Receipt Details"
            variant="secondary"
            icon={<Icon name="create-outline" size={16} color={theme.colors.text} />}
            onPress={() => {
              setEditMerchant(receipt.merchant ?? "");
              setEditAmountStr(receipt.amount_minor ? (receipt.amount_minor / 100).toString() : "");
              setIsEditing(true);
            }}
            fullWidth
          />
          <Button
            label="Delete Receipt"
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
        title="Delete Receipt"
        message="Are you sure you want to delete this receipt? The local scan and OCR items will be removed permanently."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

      {/* Edit Modal */}
      <Modal visible={isEditing} animationType="slide" transparent onRequestClose={() => setIsEditing(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <View style={[styles.modalBox, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text variant="h3">Edit Receipt Details</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Icon name="close" size={24} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 12, paddingVertical: 12 }}>
              <View>
                <Text variant="captionStrong" color="textMuted" style={{ marginBottom: 4 }}>
                  Merchant
                </Text>
                <TextInput
                  style={[
                    styles.editInput,
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
              </View>

              <View>
                <Text variant="captionStrong" color="textMuted" style={{ marginBottom: 4 }}>
                  Total Amount (KES)
                </Text>
                <TextInput
                  style={[
                    styles.editInput,
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
              </View>

              <View style={styles.modalBtnRow}>
                <Button label="Cancel" variant="ghost" onPress={() => setIsEditing(false)} style={{ flex: 1 }} />
                <Button label="Save Changes" variant="primary" onPress={handleSaveEdit} style={{ flex: 1 }} />
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
  sectionCard: {
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  catDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemsTable: {
    marginTop: 4,
  },
  tableHeaderRow: {
    flexDirection: "row",
    paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 6,
  },
  tableItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  linkedTxBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 6,
  },
  unlinkedBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 6,
  },
  ocrBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
  },
  ocrText: {
    fontFamily: "monospace",
    fontSize: 11,
    lineHeight: 16,
  },
  actionButtons: {
    gap: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBox: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  modalBtnRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
});

export default ReceiptDetailScreen;
