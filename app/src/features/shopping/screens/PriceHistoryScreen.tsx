import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useRoute, useNavigation, type RouteProp } from "@react-navigation/native";
import Svg, { Path, Circle, Line, Text as SvgText } from "react-native-svg";
import { useTheme } from "@design";
import {
  Screen,
  Header,
  Card,
  Text,
  Badge,
  StatTile,
  Icon,
} from "../../../components";
import type { MoneyStackParamList } from "../../../navigation/types";
import { useShoppingStore } from "../state/shoppingSlice";

type PriceHistoryRouteProp = RouteProp<MoneyStackParamList, "PriceHistory">;

export const PriceHistoryScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<PriceHistoryRouteProp>();

  const itemKey = route.params?.itemKey ?? "milk_500ml";
  const itemName = route.params?.itemName ?? "Item Price History";

  const getPriceHistory = useShoppingStore((state) => state.getPriceHistory);
  let history = getPriceHistory(itemKey);

  // Fallback to sample history if item has no records yet
  if (!history || history.length === 0) {
    history = [
      { id: "h1", item_key: itemKey, price_minor: 6500, currency: "KES", observed_at: "2026-05-10T00:00:00Z", source: "Carrefour" },
      { id: "h2", item_key: itemKey, price_minor: 7000, currency: "KES", observed_at: "2026-07-15T00:00:00Z", source: "QuickMart" },
      { id: "h3", item_key: itemKey, price_minor: 7500, currency: "KES", observed_at: "2026-09-22T00:00:00Z", source: "Naivas" },
    ];
  }

  const prices = history.map((h) => h.price_minor / 100);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const currentPrice = prices[prices.length - 1];
  const firstPrice = prices[0];
  const percentChange = firstPrice > 0 ? ((currentPrice - firstPrice) / firstPrice) * 100 : 0;

  // Chart dimensions
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 64;
  const chartHeight = 140;
  const paddingBottom = 24;
  const graphHeight = chartHeight - paddingBottom;

  // SVG Line path calculation
  const priceRange = maxPrice - minPrice || 1;
  const points = history.map((h, idx) => {
    const x = (idx / (history.length - 1 || 1)) * (chartWidth - 24) + 12;
    const y = graphHeight - 10 - (((h.price_minor / 100) - minPrice) / priceRange) * (graphHeight - 24);
    return { x, y, h };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  return (
    <Screen style={styles.container}>
      <Header
        title={itemName}
        subtitle="Historical price trend"
        showBack
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stat Tiles Row */}
        <View style={styles.statTilesRow}>
          <View style={styles.statTileCol}>
            <StatTile
              label="Lowest Price"
              value={`KES ${minPrice.toLocaleString()}`}
              icon="arrow-down-circle"
            />
          </View>
          <View style={styles.statTileCol}>
            <StatTile
              label="Current Price"
              value={`KES ${currentPrice.toLocaleString()}`}
              delta={{
                value: `${Math.abs(Math.round(percentChange))}%`,
                isPositive: percentChange <= 0,
                label: "vs earliest",
              }}
              icon="pricetag"
            />
          </View>
        </View>

        {/* Price Trend Chart Card */}
        <Card style={styles.sectionCard} padding="md">
          <View style={styles.cardHeader}>
            <Text variant="h3">Price Trend</Text>
            <Badge
              label={`${history.length} observations`}
              tone="neutral"
            />
          </View>

          <Svg width={chartWidth} height={chartHeight} style={styles.svgChart}>
            {/* Grid baseline */}
            <Line
              x1={0}
              y1={graphHeight}
              x2={chartWidth}
              y2={graphHeight}
              stroke={theme.colors.border}
              strokeWidth={1}
            />

            {/* Price Line */}
            <Path
              d={pathD}
              fill="none"
              stroke={theme.colors.accent}
              strokeWidth={3}
            />

            {/* Dots and Labels */}
            {points.map((p, idx) => (
              <React.Fragment key={p.h.id || idx}>
                <Circle
                  cx={p.x}
                  cy={p.y}
                  r={5}
                  fill={theme.colors.surface}
                  stroke={theme.colors.accent}
                  strokeWidth={2}
                />
                <SvgText
                  x={p.x}
                  y={chartHeight - 4}
                  fill={theme.colors.textMuted}
                  fontSize={10}
                  textAnchor="middle"
                >
                  {new Date(p.h.observed_at).toLocaleDateString(undefined, { month: "short" })}
                </SvgText>
              </React.Fragment>
            ))}
          </Svg>
        </Card>

        {/* Store Comparison Card */}
        <Card style={styles.sectionCard} padding="md">
          <Text variant="h3" style={{ marginBottom: 12 }}>
            Observations by Merchant
          </Text>

          {history.map((record, index) => {
            const formattedDate = new Date(record.observed_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            const price = record.price_minor / 100;
            const isLowest = price === minPrice;

            return (
              <View
                key={record.id}
                style={[
                  styles.recordRow,
                  index < history.length - 1 && { borderBottomColor: theme.colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
                ]}
              >
                <View style={styles.recordLeft}>
                  <Text variant="bodyStrong" color="text">
                    {record.source}
                  </Text>
                  <Text variant="caption" color="textMuted">
                    {formattedDate}
                  </Text>
                </View>

                <View style={styles.recordRight}>
                  <Text variant="bodyStrong" color="text">
                    {`KES ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  </Text>
                  {isLowest && (
                    <Badge label="Best Price" tone="success" style={{ marginTop: 2 }} />
                  )}
                </View>
              </View>
            );
          })}
        </Card>
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
  statTilesRow: {
    flexDirection: "row",
    gap: 12,
  },
  statTileCol: {
    flex: 1,
  },
  sectionCard: {
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  svgChart: {
    marginVertical: 6,
  },
  recordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  recordLeft: {
    flex: 1,
  },
  recordRight: {
    alignItems: "flex-end",
  },
});

export default PriceHistoryScreen;
