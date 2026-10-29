import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@design";
import { Card, Text, Divider, Icon, Badge } from "../../../components";
import type { DashboardMockData } from "../mock";

export type ShoppingCardProps = {
  data: DashboardMockData["shopping"];
  onPress: () => void;
};

export const ShoppingCard: React.FC<ShoppingCardProps> = ({
  data,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Card style={styles.card} padding="md">
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Icon name="cart-outline" size={20} color={theme.colors.accent} />
            <Text variant="h3" style={styles.title}>
              Shopping Lists
            </Text>
          </View>
          <Badge label={`${data.openListCount} active`} tone="neutral" />
        </View>

        <View style={styles.contentRow}>
          <View>
            <Text variant="caption" color="textMuted">
              Current Active List
            </Text>
            <Text variant="bodyStrong" color="text" style={styles.listName}>
              {data.nextList.name}
            </Text>
            <Text variant="caption" color="textSubtle" style={styles.itemsSub}>
              {`${data.nextList.itemsLeft} items left to buy`}
            </Text>
          </View>

          <View style={styles.estimatedBlock}>
            <Text variant="caption" color="textMuted">
              Est. Total
            </Text>
            <Text variant="h3" color="text">
              {`KES ${(data.estimatedTotalMinor / 100).toLocaleString()}`}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.footerRow}>
          <Text variant="caption" color="textMuted">
            {`${data.openItemCount} total pending items across lists`}
          </Text>
          <View style={styles.arrowRow}>
            <Text variant="captionStrong" color="accent">
              View Lists
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
    marginBottom: 12,
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
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listName: {
    marginTop: 4,
  },
  itemsSub: {
    marginTop: 2,
  },
  estimatedBlock: {
    alignItems: "flex-end",
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
