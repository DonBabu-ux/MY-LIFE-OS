import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@design";
import { Card, Text, Divider, Icon, Badge } from "../../../components";
import type { DashboardMockData } from "../mock";

export type VaultCardProps = {
  data: DashboardMockData["vault"];
  onPress: () => void;
};

export const VaultCard: React.FC<VaultCardProps> = ({
  data,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Card style={styles.card} padding="md">
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Icon name="lock-closed-outline" size={20} color={theme.colors.accent} />
            <Text variant="h3" style={styles.title}>
              Private Vault
            </Text>
          </View>
          <Badge label="Encrypted" tone="success" />
        </View>

        <View style={styles.itemsBlock}>
          {/* Note row */}
          <View style={styles.itemRow}>
            <Icon name="document-text-outline" size={16} color={theme.colors.accent} />
            <View style={styles.itemTextCol}>
              <Text variant="bodyStrong" color="text" numberOfLines={1}>
                {data.recentNote.title}
              </Text>
              <Text variant="caption" color="textSubtle">
                {`Note · ${data.recentNote.updatedAt}`}
              </Text>
            </View>
          </View>

          {/* Receipt row */}
          <View style={styles.itemRow}>
            <Icon name="receipt-outline" size={16} color={theme.colors.accent} />
            <View style={styles.itemTextCol}>
              <Text variant="bodyStrong" color="text" numberOfLines={1}>
                {`${data.recentReceipt.merchant} — KES ${(data.recentReceipt.amountMinor / 100).toLocaleString()}`}
              </Text>
              <Text variant="caption" color="textSubtle">
                {`Scanned receipt · ${data.recentReceipt.date}`}
              </Text>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.footerRow}>
          <Text variant="caption" color="textMuted">
            Zero cloud telemetry · Local vault
          </Text>
          <View style={styles.arrowRow}>
            <Text variant="captionStrong" color="accent">
              Open Vault
            </Text>
            <Icon name="chevron-forward" size={14} color={theme.colors.accent} />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
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
  title: {
    marginLeft: 4,
  },
  itemsBlock: {
    gap: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  itemTextCol: {
    flex: 1,
  },
  divider: {
    marginVertical: 12,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  arrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
});
