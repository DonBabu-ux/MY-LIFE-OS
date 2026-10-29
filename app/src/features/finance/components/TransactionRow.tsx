import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@design";
import { Text, Icon } from "../../../components";
import type { Transaction, Category } from "@shared/entities";
import { TransactionType } from "@shared/enums";

export type TransactionRowProps = {
  transaction: Transaction;
  category?: Category;
  onPress: () => void;
};

export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  category,
  onPress,
}) => {
  const theme = useTheme();

  const isIncome = transaction.type === TransactionType.Income;
  const isTransfer = transaction.type === TransactionType.Transfer;
  const amountFormatted = `${isIncome ? "+" : isTransfer ? "" : "-"}KES ${(
    transaction.amount_minor / 100
  ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const categoryColor = category?.color ?? theme.colors.accent;
  const iconName = category?.icon ?? (isIncome ? "arrow-down-circle-outline" : "arrow-up-circle-outline");

  const formattedDate = new Date(transaction.occurred_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.container}>
      <View style={[styles.iconWrapper, { backgroundColor: `${categoryColor}20` }]}>
        <Icon name={iconName} size={20} color={categoryColor} />
      </View>

      <View style={styles.detailsCol}>
        <Text variant="bodyStrong" color="text" numberOfLines={1}>
          {transaction.merchant || category?.name || "Transaction"}
        </Text>
        <Text variant="caption" color="textMuted" numberOfLines={1}>
          {`${category?.name || "Uncategorized"} · ${formattedDate}`}
        </Text>
      </View>

      <View style={styles.amountCol}>
        <Text
          variant="bodyStrong"
          color={isIncome ? "income" : isTransfer ? "text" : "text"}
          style={styles.amountText}
        >
          {amountFormatted}
        </Text>
        {transaction.source === "sms" && (
          <Text variant="caption" color="textSubtle">
            SMS
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailsCol: {
    flex: 1,
    marginRight: 8,
  },
  amountCol: {
    alignItems: "flex-end",
  },
  amountText: {
    fontWeight: "600",
  },
});
