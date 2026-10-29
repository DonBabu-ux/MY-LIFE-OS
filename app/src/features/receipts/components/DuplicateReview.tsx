import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from "react-native";
import { useTheme } from "@design";
import { Text, Badge, Button, Icon, Card } from "../../../components";
import type { DuplicateCandidate } from "../mock";

export type DuplicateReviewProps = {
  visible: boolean;
  duplicateCandidate: DuplicateCandidate;
  onClose: () => void;
  onResolve: (action: "keep_both" | "merge" | "ignore") => void;
};

export const DuplicateReview: React.FC<DuplicateReviewProps> = ({
  visible,
  duplicateCandidate,
  onClose,
  onResolve,
}) => {
  const theme = useTheme();

  const { receiptA, receiptB, similarityScore, reason } = duplicateCandidate;

  const formatAmount = (minor?: number | null) =>
    minor
      ? `KES ${(minor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      : "KES 0.00";

  const formatDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
        <View style={[styles.sheetContainer, { backgroundColor: theme.colors.surface }]}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <View style={styles.titleRow}>
                <Icon name="copy-outline" size={20} color={theme.colors.warning} />
                <Text variant="h3">Duplicate Review</Text>
              </View>
              <Text variant="caption" color="textMuted">
                {`${Math.round(similarityScore * 100)}% match detected`}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon name="close" size={22} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Explanation Alert */}
          <View style={[styles.reasonBox, { backgroundColor: `${theme.colors.warning}15`, borderColor: theme.colors.warning }]}>
            <Icon name="information-circle" size={16} color={theme.colors.warning} style={{ marginTop: 2 }} />
            <Text variant="caption" color="text" style={{ flex: 1 }}>
              {reason}
            </Text>
          </View>

          {/* Side-by-Side Comparison */}
          <ScrollView contentContainerStyle={styles.compareContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.sideBySideRow}>
              {/* Receipt A */}
              <Card style={styles.receiptCol} padding="sm">
                <Badge label="Original (A)" tone="neutral" style={{ marginBottom: 6 }} />
                <Text variant="captionStrong" color="text" numberOfLines={1}>
                  {receiptA.merchant}
                </Text>
                <Text variant="bodyStrong" color="text" style={styles.amountText}>
                  {formatAmount(receiptA.amount_minor)}
                </Text>
                <Text variant="caption" color="textMuted">
                  Time: {formatDate(receiptA.occurred_at)}
                </Text>
                <Text variant="caption" color="textSubtle">
                  Source: {receiptA.source}
                </Text>

                <View style={styles.divider} />
                <Text variant="captionStrong" color="textMuted" style={{ marginBottom: 4 }}>
                  Items ({receiptA.items?.length ?? 0}):
                </Text>
                {receiptA.items?.map((it) => (
                  <Text key={it.id} variant="caption" color="text" numberOfLines={1}>
                    • {it.name}
                  </Text>
                ))}
              </Card>

              {/* Receipt B */}
              <Card style={styles.receiptCol} padding="sm">
                <Badge label="Duplicate Candidate (B)" tone="warning" style={{ marginBottom: 6 }} />
                <Text variant="captionStrong" color="text" numberOfLines={1}>
                  {receiptB.merchant}
                </Text>
                <Text variant="bodyStrong" color="text" style={styles.amountText}>
                  {formatAmount(receiptB.amount_minor)}
                </Text>
                <Text variant="caption" color="textMuted">
                  Time: {formatDate(receiptB.occurred_at)}
                </Text>
                <Text variant="caption" color="textSubtle">
                  Source: {receiptB.source}
                </Text>

                <View style={styles.divider} />
                <Text variant="captionStrong" color="textMuted" style={{ marginBottom: 4 }}>
                  Items ({receiptB.items?.length ?? 0}):
                </Text>
                {receiptB.items?.map((it) => (
                  <Text key={it.id} variant="caption" color="text" numberOfLines={1}>
                    • {it.name}
                  </Text>
                ))}
              </Card>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionsFooter}>
            <Button
              label="Merge into One (Keep A)"
              variant="primary"
              onPress={() => onResolve("merge")}
              fullWidth
            />
            <View style={styles.secondaryActions}>
              <Button
                label="Keep Both"
                variant="secondary"
                onPress={() => onResolve("keep_both")}
                style={{ flex: 1 }}
              />
              <Button
                label="Ignore / Not Duplicate"
                variant="ghost"
                onPress={() => onResolve("ignore")}
                style={{ flex: 1 }}
              />
            </View>
          </View>
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
    maxHeight: "90%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  closeBtn: {
    padding: 4,
  },
  reasonBox: {
    flexDirection: "row",
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  compareContainer: {
    paddingBottom: 8,
  },
  sideBySideRow: {
    flexDirection: "row",
    gap: 10,
  },
  receiptCol: {
    flex: 1,
    borderRadius: 12,
  },
  amountText: {
    fontSize: 15,
    marginVertical: 4,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(150,150,150,0.2)",
    marginVertical: 8,
  },
  actionsFooter: {
    gap: 10,
    marginTop: 12,
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 10,
  },
});

export default DuplicateReview;
