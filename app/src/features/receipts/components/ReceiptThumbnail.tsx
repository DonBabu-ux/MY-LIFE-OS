import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@design";
import { Text, Badge, Icon } from "../../../components";
import type { Receipt } from "@shared/entities";
import { ReceiptSource } from "@shared/enums";

export type ReceiptThumbnailProps = {
  receipt: Receipt;
  viewMode?: "grid" | "list";
  onPress: () => void;
};

export const ReceiptThumbnail: React.FC<ReceiptThumbnailProps> = ({
  receipt,
  viewMode = "grid",
  onPress,
}) => {
  const theme = useTheme();

  const isGrid = viewMode === "grid";
  const formattedAmount = receipt.amount_minor
    ? `KES ${(receipt.amount_minor / 100).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "KES 0.00";

  const formattedDate = receipt.occurred_at
    ? new Date(receipt.occurred_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "";

  const sourceIcon =
    receipt.source === ReceiptSource.Camera
      ? "camera"
      : receipt.source === ReceiptSource.Share
      ? "share-social"
      : "document-text";

  if (isGrid) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          styles.gridContainer,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {/* Receipt paper preview header */}
        <View style={[styles.receiptPaperHeader, { backgroundColor: theme.colors.surfaceAlt }]}>
          <View style={styles.zigzagPattern}>
            {[...Array(6)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.zigzagDot,
                  { backgroundColor: theme.colors.border },
                ]}
              />
            ))}
          </View>
          <Icon name="receipt-outline" size={24} color={theme.colors.accent} />
          <View style={styles.sourceBadgeWrapper}>
            <Icon name={sourceIcon} size={12} color={theme.colors.textMuted} />
          </View>
        </View>

        {/* Content */}
        <View style={styles.gridContent}>
          <Text variant="captionStrong" color="text" numberOfLines={1}>
            {receipt.merchant || "Unknown Merchant"}
          </Text>

          <Text variant="bodyStrong" color="text" style={styles.gridAmount}>
            {formattedAmount}
          </Text>

          <View style={styles.gridFooter}>
            <Text variant="caption" color="textMuted">
              {formattedDate}
            </Text>
            {receipt.items && receipt.items.length > 0 && (
              <Badge
                label={`${receipt.items.length} items`}
                tone="neutral"
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // List view mode
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.listContainer,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={[styles.listIconBox, { backgroundColor: theme.colors.surfaceAlt }]}>
        <Icon name="receipt-outline" size={20} color={theme.colors.accent} />
      </View>

      <View style={styles.listDetails}>
        <Text variant="bodyStrong" color="text" numberOfLines={1}>
          {receipt.merchant || "Receipt"}
        </Text>
        <Text variant="caption" color="textMuted">
          {`${formattedDate} · ${receipt.items?.length ?? 0} items`}
        </Text>
      </View>

      <View style={styles.listAmountCol}>
        <Text variant="bodyStrong" color="text">
          {formattedAmount}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
          <Icon name={sourceIcon} size={11} color={theme.colors.textSubtle} />
          <Text variant="caption" color="textSubtle">
            {receipt.source}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    width: "48%",
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
  },
  receiptPaperHeader: {
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  zigzagPattern: {
    position: "absolute",
    top: 6,
    flexDirection: "row",
    gap: 8,
  },
  zigzagDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  sourceBadgeWrapper: {
    position: "absolute",
    top: 6,
    right: 8,
  },
  gridContent: {
    padding: 10,
    gap: 4,
  },
  gridAmount: {
    fontSize: 14,
    fontWeight: "700",
  },
  gridFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  listContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  listIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  listDetails: {
    flex: 1,
  },
  listAmountCol: {
    alignItems: "flex-end",
  },
});

export default ReceiptThumbnail;
