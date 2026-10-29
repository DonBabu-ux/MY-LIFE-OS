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
  Input,
  useToast,
} from "../../../components";
import { useFinanceStore } from "../state/financeSlice";
import { CategoryPicker } from "../components/CategoryPicker";
import { TransactionType, SourceType, CategoryKind } from "@shared/enums";

export const AddTransactionScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { show: showToast } = useToast();

  const categories = useFinanceStore((state) => state.categories);
  const addTransaction = useFinanceStore((state) => state.addTransaction);

  const [type, setType] = useState<TransactionType>(TransactionType.Expense);
  const [amountStr, setAmountStr] = useState<string>("0");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [merchant, setMerchant] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [reference, setReference] = useState<string>("");
  const [dateOption, setDateOption] = useState<"today" | "yesterday">("today");

  // Filter categories by type
  const filteredCategories = categories.filter((cat) => {
    if (type === TransactionType.Expense) return cat.kind === CategoryKind.Expense;
    if (type === TransactionType.Income) return cat.kind === CategoryKind.Income;
    if (type === TransactionType.Transfer) return cat.kind === CategoryKind.Transfer;
    return true;
  });

  // Numeric keypad handler
  const handleKeyPress = (val: string) => {
    if (val === "backspace") {
      setAmountStr((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
      return;
    }
    if (val === ".") {
      if (!amountStr.includes(".")) {
        setAmountStr((prev) => prev + ".");
      }
      return;
    }
    // Number key
    if (amountStr === "0") {
      setAmountStr(val);
    } else {
      // Limit decimal places to 2
      const parts = amountStr.split(".");
      if (parts[1] && parts[1].length >= 2) return;
      if (amountStr.length >= 10) return;
      setAmountStr((prev) => prev + val);
    }
  };

  const handleQuickAdd = (addValue: number) => {
    const current = parseFloat(amountStr) || 0;
    const next = current + addValue;
    setAmountStr(next.toString());
  };

  const handleSave = () => {
    const amount = parseFloat(amountStr);
    if (!amount || amount <= 0) {
      showToast("Please enter an amount greater than zero", "danger");
      return;
    }

    const now = new Date();
    let occurred_at = now.toISOString();
    if (dateOption === "yesterday") {
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, now.getHours(), now.getMinutes());
      occurred_at = yesterday.toISOString();
    }

    addTransaction({
      type,
      amount_minor: Math.round(amount * 100),
      currency: "KES",
      occurred_at,
      merchant: merchant.trim() || null,
      description: description.trim() || null,
      reference: reference.trim() || null,
      category_id: selectedCategoryId,
      source: SourceType.Manual,
    });

    showToast("Transaction saved successfully", "success");
    navigation.goBack();
  };

  const numericValue = parseFloat(amountStr) || 0;
  const isIncome = type === TransactionType.Income;
  const isTransfer = type === TransactionType.Transfer;
  const amountColor = isIncome ? theme.colors.income : isTransfer ? theme.colors.text : theme.colors.expense;

  return (
    <Screen style={styles.container}>
      <Header
        title="New Transaction"
        subtitle="Manual entry"
        showBack
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Type Selector (Expense / Income / Transfer) */}
        <View style={[styles.typeSelector, { backgroundColor: theme.colors.surfaceAlt }]}>
          {[
            { label: "Expense", value: TransactionType.Expense },
            { label: "Income", value: TransactionType.Income },
            { label: "Transfer", value: TransactionType.Transfer },
          ].map((item) => {
            const active = type === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                activeOpacity={0.7}
                onPress={() => {
                  setType(item.value);
                  setSelectedCategoryId(null); // Reset category if switching types
                }}
                style={[
                  styles.typeTab,
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
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Hero Amount Display */}
        <Card style={styles.amountCard} padding="lg">
          <Text variant="captionStrong" color="textMuted">
            ENTER AMOUNT (KES)
          </Text>
          <View style={styles.amountDisplayRow}>
            <Text
              style={[
                styles.amountDisplay,
                { color: amountColor },
              ]}
            >
              {`KES ${numericValue.toLocaleString(undefined, {
                minimumFractionDigits: amountStr.includes(".") ? (amountStr.split(".")[1]?.length ?? 0) : 0,
                maximumFractionDigits: 2,
              })}`}
            </Text>
          </View>

          {/* Quick amount chips */}
          <View style={styles.quickAddRow}>
            {[100, 500, 1000, 5000].map((val) => (
              <TouchableOpacity
                key={val}
                activeOpacity={0.7}
                onPress={() => handleQuickAdd(val)}
                style={[
                  styles.quickAddChip,
                  {
                    backgroundColor: theme.colors.surfaceAlt,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text variant="captionStrong" color="text">
                  {`+${val.toLocaleString()}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Amount Numeric Keypad */}
        <Card style={styles.keypadCard} padding="sm">
          <View style={styles.keypadGrid}>
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "backspace"].map((k) => (
              <TouchableOpacity
                key={k}
                activeOpacity={0.6}
                onPress={() => handleKeyPress(k)}
                style={[
                  styles.keypadKey,
                  { backgroundColor: theme.colors.surfaceAlt },
                ]}
              >
                {k === "backspace" ? (
                  <Icon name="backspace-outline" size={22} color={theme.colors.text} />
                ) : (
                  <Text variant="h3" color="text">
                    {k}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Category Picker Section */}
        <Card style={styles.sectionCard} padding="md">
          <View style={styles.sectionTitleRow}>
            <Text variant="h3">Category</Text>
            <Text variant="caption" color="textMuted">
              {filteredCategories.length} available
            </Text>
          </View>
          <CategoryPicker
            categories={filteredCategories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(cat) => setSelectedCategoryId(cat.id)}
          />
        </Card>

        {/* Details & Metadata Section */}
        <Card style={styles.sectionCard} padding="md">
          <Text variant="h3" style={{ marginBottom: 12 }}>
            Details
          </Text>

          {/* Merchant */}
          <Input
            label="Merchant / Payee"
            placeholder="e.g. Java House, Supermarket, Client..."
            value={merchant}
            onChangeText={setMerchant}
            containerStyle={{ marginBottom: 12 }}
          />

          {/* Date Selector */}
          <Text variant="captionStrong" color="textMuted" style={{ marginBottom: 6 }}>
            Date
          </Text>
          <View style={styles.dateOptionsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setDateOption("today")}
              style={[
                styles.dateChip,
                {
                  backgroundColor:
                    dateOption === "today"
                      ? theme.colors.accentSubtle
                      : theme.colors.surfaceAlt,
                  borderColor:
                    dateOption === "today"
                      ? theme.colors.accent
                      : theme.colors.border,
                },
              ]}
            >
              <Text
                variant="captionStrong"
                color={dateOption === "today" ? "accent" : "textMuted"}
              >
                Today
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setDateOption("yesterday")}
              style={[
                styles.dateChip,
                {
                  backgroundColor:
                    dateOption === "yesterday"
                      ? theme.colors.accentSubtle
                      : theme.colors.surfaceAlt,
                  borderColor:
                    dateOption === "yesterday"
                      ? theme.colors.accent
                      : theme.colors.border,
                },
              ]}
            >
              <Text
                variant="captionStrong"
                color={dateOption === "yesterday" ? "accent" : "textMuted"}
              >
                Yesterday
              </Text>
            </TouchableOpacity>
          </View>

          {/* Reference Code */}
          <Input
            label="Reference Code (Optional)"
            placeholder="e.g. M-Pesa ID, Bank Ref..."
            value={reference}
            onChangeText={setReference}
            containerStyle={{ marginVertical: 12 }}
          />

          {/* Note / Description */}
          <Text variant="captionStrong" color="textMuted" style={{ marginBottom: 6 }}>
            Note / Description
          </Text>
          <TextInput
            style={[
              styles.notesInput,
              {
                color: theme.colors.text,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
              },
            ]}
            multiline
            numberOfLines={3}
            placeholder="Additional notes about this transaction..."
            placeholderTextColor={theme.colors.textSubtle}
            value={description}
            onChangeText={setDescription}
          />
        </Card>

        {/* Save Button */}
        <View style={styles.saveSection}>
          <Button
            label="Save Transaction"
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
  typeSelector: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
  },
  typeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
  },
  amountCard: {
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 20,
  },
  amountDisplayRow: {
    marginVertical: 12,
  },
  amountDisplay: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  quickAddRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  quickAddChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  keypadCard: {
    borderRadius: 16,
  },
  keypadGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
    padding: 4,
  },
  keypadKey: {
    width: "31%",
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionCard: {
    borderRadius: 16,
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dateOptionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  dateChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  notesInput: {
    minHeight: 80,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    textAlignVertical: "top",
  },
  saveSection: {
    marginTop: 4,
  },
});

export default AddTransactionScreen;
