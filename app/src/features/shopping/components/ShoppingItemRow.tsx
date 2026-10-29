import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@design";
import { Text, Badge, Icon } from "../../../components";
import type { ShoppingItem } from "@shared/entities";

export type ShoppingItemRowProps = {
  item: ShoppingItem;
  onTogglePurchased: () => void;
  onIncrementQty: () => void;
  onDecrementQty: () => void;
  onLinkTransaction: () => void;
  onViewPriceHistory: () => void;
  onDelete: () => void;
};

export const ShoppingItemRow: React.FC<ShoppingItemRowProps> = ({
  item,
  onTogglePurchased,
  onIncrementQty,
  onDecrementQty,
  onLinkTransaction,
  onViewPriceHistory,
  onDelete,
}) => {
  const theme = useTheme();

  const isPurchased = item.purchased;

  const priorityColor =
    item.priority === 1
      ? theme.colors.danger
      : item.priority === 2
      ? theme.colors.warning
      : theme.colors.accent;

  const priorityLabel =
    item.priority === 1 ? "High" : item.priority === 2 ? "Med" : "Low";

  const priceMinor = item.actual_price_minor ?? item.estimated_price_minor;
  const formattedUnitPrice = priceMinor
    ? `KES ${(priceMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    : null;

  const totalItemMinor = priceMinor ? priceMinor * item.quantity : null;
  const formattedTotalPrice = totalItemMinor
    ? `KES ${(totalItemMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    : null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isPurchased ? `${theme.colors.surfaceAlt}80` : theme.colors.surface,
          borderColor: theme.colors.border,
          opacity: isPurchased ? 0.75 : 1,
        },
      ]}
    >
      {/* Checkbox */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onTogglePurchased}
        style={[
          styles.checkbox,
          {
            backgroundColor: isPurchased ? theme.colors.accent : "transparent",
            borderColor: isPurchased ? theme.colors.accent : theme.colors.border,
          },
        ]}
      >
        {isPurchased && <Icon name="checkmark" size={14} color={theme.colors.onAccent} />}
      </TouchableOpacity>

      {/* Main Details */}
      <View style={styles.detailsCol}>
        <View style={styles.titleRow}>
          <Text
            variant="bodyStrong"
            color={isPurchased ? "textMuted" : "text"}
            style={[isPurchased && styles.strikethrough]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <View style={[styles.priorityPill, { backgroundColor: `${priorityColor}20` }]}>
            <Text style={[styles.priorityText, { color: priorityColor }]}>
              {priorityLabel}
            </Text>
          </View>
        </View>

        <View style={styles.subRow}>
          <Text variant="caption" color="textMuted">
            {formattedUnitPrice ? `${formattedUnitPrice} / ${item.unit || "unit"}` : "No price set"}
          </Text>

          {item.transaction_id && (
            <Badge label="Linked to Tx" tone="success" style={{ marginLeft: 6 }} />
          )}
        </View>
      </View>

      {/* Quantity Stepper & Price Column */}
      <View style={styles.actionsCol}>
        {/* Total item price */}
        {formattedTotalPrice && (
          <Text variant="captionStrong" color={isPurchased ? "textMuted" : "text"} style={styles.totalText}>
            {`${item.actual_price_minor ? "" : "~"}${formattedTotalPrice}`}
          </Text>
        )}

        {/* Stepper & Tools */}
        <View style={styles.toolsRow}>
          {/* Stepper */}
          <View style={[styles.stepper, { borderColor: theme.colors.border }]}>
            <TouchableOpacity onPress={onDecrementQty} style={styles.stepBtn}>
              <Icon name="remove" size={12} color={theme.colors.textMuted} />
            </TouchableOpacity>
            <Text variant="captionStrong" color="text" style={styles.qtyText}>
              {item.quantity}
            </Text>
            <TouchableOpacity onPress={onIncrementQty} style={styles.stepBtn}>
              <Icon name="add" size={12} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Price History Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onViewPriceHistory}
            style={styles.iconBtn}
          >
            <Icon name="trending-up-outline" size={16} color={theme.colors.accent} />
          </TouchableOpacity>

          {/* Link to Tx button */}
          {!item.transaction_id && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onLinkTransaction}
              style={styles.iconBtn}
            >
              <Icon name="link-outline" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}

          {/* Delete item button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onDelete}
            style={styles.iconBtn}
          >
            <Icon name="trash-outline" size={15} color={theme.colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  detailsCol: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
  priorityPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "700",
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  actionsCol: {
    alignItems: "flex-end",
    gap: 4,
  },
  totalText: {
    fontSize: 12,
  },
  toolsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 6,
    height: 24,
  },
  stepBtn: {
    paddingHorizontal: 4,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 11,
    minWidth: 16,
    textAlign: "center",
  },
  iconBtn: {
    padding: 4,
  },
});

export default ShoppingItemRow;
