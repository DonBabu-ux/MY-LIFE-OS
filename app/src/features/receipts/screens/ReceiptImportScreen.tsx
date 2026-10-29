import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
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
  Button,
  Icon,
  Badge,
  Input,
  useToast,
} from "../../../components";
import { Routes } from "../../../navigation/routes";
import { useReceiptsStore } from "../state/receiptsSlice";
import { useFinanceStore } from "../../finance/state/financeSlice";
import { ReceiptSource, TransactionType } from "@shared/enums";

type ImportSource = "camera" | "gallery" | "file";

export const ReceiptImportScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { show: showToast } = useToast();

  const addReceipt = useReceiptsStore((state) => state.addReceipt);
  const addTransaction = useFinanceStore((state) => state.addTransaction);

  const [selectedSource, setSelectedSource] = useState<ImportSource | null>("camera");
  const [isProcessing, setIsProcessing] = useState(false);
  const [extracted, setExtracted] = useState(true);

  // Extracted fields
  const [merchant, setMerchant] = useState("QuickMart Supermarket");
  const [amountStr, setAmountStr] = useState("3450.00");
  const [createLedgerTx, setCreateLedgerTx] = useState(true);

  const handleSourceSelect = (source: ImportSource) => {
    setSelectedSource(source);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setExtracted(true);
      showToast("OCR extracted 4 items and total", "success");
    }, 700);
  };

  const handleSave = () => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      showToast("Please enter a valid amount", "danger");
      return;
    }

    const amountMinor = Math.round(amount * 100);
    const sourceEnum =
      selectedSource === "camera"
        ? ReceiptSource.Camera
        : selectedSource === "gallery"
        ? ReceiptSource.Import
        : ReceiptSource.Import;

    // 1. Add receipt
    const newReceipt = addReceipt({
      merchant,
      amount_minor: amountMinor,
      source: sourceEnum,
      category_id: "cat-2", // Groceries
      extracted_text: `${merchant.toUpperCase()}\nTEL: 0712-345678\n4 ITEMS\nTOTAL: KES ${amount.toFixed(2)}`,
      items: [
        { name: "Fresh Milk 500ml", quantity: 2, unit_price_minor: 7500 },
        { name: "Brown Bread 400g", quantity: 1, unit_price_minor: 8500 },
        { name: "Sugar 2kg", quantity: 1, unit_price_minor: 32000 },
        { name: "Washing Powder 3kg", quantity: 1, unit_price_minor: 289500 },
      ],
    });

    // 2. Optionally create ledger transaction
    if (createLedgerTx) {
      addTransaction({
        type: TransactionType.Expense,
        amount_minor: amountMinor,
        currency: "KES",
        merchant,
        category_id: "cat-2",
        receipt_id: newReceipt.id,
        description: "Scanned paper receipt purchase",
      });
    }

    showToast("Receipt saved to local vault", "success");
    navigation.navigate(Routes.ReceiptDetail, { id: newReceipt.id });
  };

  return (
    <Screen style={styles.container}>
      <Header title="Scan & Import Receipt" subtitle="Offline on-device OCR" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Source Selection Cards */}
        <Text variant="captionStrong" color="textMuted">
          SELECT IMPORT METHOD
        </Text>
        <View style={styles.sourcesRow}>
          {[
            { id: "camera", label: "Camera", icon: "camera-outline" },
            { id: "gallery", label: "Gallery", icon: "images-outline" },
            { id: "file", label: "PDF / File", icon: "document-attach-outline" },
          ].map((src) => {
            const isSelected = selectedSource === src.id;
            return (
              <TouchableOpacity
                key={src.id}
                activeOpacity={0.7}
                onPress={() => handleSourceSelect(src.id as ImportSource)}
                style={[
                  styles.sourceCard,
                  {
                    backgroundColor: isSelected ? theme.colors.accentSubtle : theme.colors.surface,
                    borderColor: isSelected ? theme.colors.accent : theme.colors.border,
                  },
                ]}
              >
                <Icon
                  name={src.icon}
                  size={24}
                  color={isSelected ? theme.colors.accent : theme.colors.textMuted}
                />
                <Text
                  variant="captionStrong"
                  color={isSelected ? "accent" : "text"}
                  style={{ marginTop: 6 }}
                >
                  {src.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Viewfinder Preview Simulation */}
        <Card style={styles.previewCard} padding="md">
          <View style={styles.previewHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Icon name="scan" size={16} color={theme.colors.accent} />
              <Text variant="bodyStrong">
                {selectedSource === "camera"
                  ? "Camera Frame (Capture Disabled in Demo)"
                  : selectedSource === "gallery"
                  ? "Photo Selected"
                  : "Document Picked"}
              </Text>
            </View>
            <Badge label="Local OCR" tone="success" />
          </View>

          {/* Simulated scanning frame */}
          <View style={[styles.scannerFrame, { borderColor: theme.colors.accent }]}>
            <View style={[styles.scannerBeam, { backgroundColor: theme.colors.accent }]} />
            <Icon name="receipt" size={60} color={theme.colors.textSubtle} />
            <Text variant="caption" color="textMuted" style={{ marginTop: 12 }}>
              {isProcessing ? "Processing with on-device Tesseract..." : "Receipt bounds detected"}
            </Text>
          </View>
        </Card>

        {/* Extracted Fields Form */}
        {extracted && (
          <Card style={styles.fieldsCard} padding="md">
            <View style={styles.fieldsHeader}>
              <Text variant="h3">Parsed Information</Text>
              <Badge label="94% Confidence" tone="neutral" />
            </View>

            <Input
              label="Merchant"
              value={merchant}
              onChangeText={setMerchant}
              containerStyle={{ marginBottom: 12 }}
            />

            <Input
              label="Total Amount (KES)"
              value={amountStr}
              onChangeText={setAmountStr}
              keyboardType="numeric"
              containerStyle={{ marginBottom: 12 }}
            />

            {/* Checkbox toggle: Create Ledger Entry */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setCreateLedgerTx(!createLedgerTx)}
              style={styles.checkboxRow}
            >
              <View
                style={[
                  styles.checkboxBox,
                  {
                    backgroundColor: createLedgerTx ? theme.colors.accent : "transparent",
                    borderColor: createLedgerTx ? theme.colors.accent : theme.colors.border,
                  },
                ]}
              >
                {createLedgerTx && <Icon name="checkmark" size={14} color={theme.colors.onAccent} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodyStrong">Create Ledger Entry in Finance</Text>
                <Text variant="caption" color="textMuted">
                  Automatically link an expense transaction to this receipt
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        )}

        {/* Action Button */}
        <View style={styles.actionSection}>
          <Button
            label="Save Receipt to Vault"
            variant="primary"
            size="lg"
            onPress={handleSave}
            fullWidth
          />
        </View>
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
  sourcesRow: {
    flexDirection: "row",
    gap: 12,
  },
  sourceCard: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  previewCard: {
    borderRadius: 16,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  scannerFrame: {
    height: 180,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  scannerBeam: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.6,
  },
  fieldsCard: {
    borderRadius: 16,
  },
  fieldsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 4,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  actionSection: {
    marginTop: 8,
  },
});

export default ReceiptImportScreen;
