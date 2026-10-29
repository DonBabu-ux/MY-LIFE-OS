import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Rect, Line, Text as SvgText } from "react-native-svg";
import { useTheme } from "@design";
import { Text } from "../../../components";

export type CashflowDataPoint = {
  label: string;
  incomeMinor: number;
  expenseMinor: number;
};

export type CashflowChartProps = {
  data?: CashflowDataPoint[];
  height?: number;
};

const defaultData: CashflowDataPoint[] = [
  { label: "Mon", incomeMinor: 1200000, expenseMinor: 450000 },
  { label: "Tue", incomeMinor: 0, expenseMinor: 850000 },
  { label: "Wed", incomeMinor: 3500000, expenseMinor: 1200000 },
  { label: "Thu", incomeMinor: 0, expenseMinor: 240000 },
  { label: "Fri", incomeMinor: 15000000, expenseMinor: 325000 },
  { label: "Sat", incomeMinor: 500000, expenseMinor: 1800000 },
  { label: "Sun", incomeMinor: 0, expenseMinor: 620000 },
];

export const CashflowChart: React.FC<CashflowChartProps> = ({
  data = defaultData,
  height = 160,
}) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 64; // accounting for card padding

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.incomeMinor, d.expenseMinor)),
    100000
  );

  const paddingBottom = 24;
  const chartHeight = height - paddingBottom;
  const barWidth = 10;
  const groupSpacing = chartWidth / data.length;

  return (
    <View style={styles.container}>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.income }]} />
          <Text variant="caption" color="textMuted">
            Income
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.expense }]} />
          <Text variant="caption" color="textMuted">
            Expense
          </Text>
        </View>
      </View>

      <Svg width={chartWidth} height={height}>
        {/* Baseline grid */}
        <Line
          x1={0}
          y1={chartHeight}
          x2={chartWidth}
          y2={chartHeight}
          stroke={theme.colors.border}
          strokeWidth={1}
        />

        {data.map((d, index) => {
          const groupCenter = index * groupSpacing + groupSpacing / 2;
          const incomeBarHeight = (d.incomeMinor / maxVal) * (chartHeight - 10);
          const expenseBarHeight = (d.expenseMinor / maxVal) * (chartHeight - 10);

          return (
            <React.Fragment key={d.label}>
              {/* Income bar */}
              <Rect
                x={groupCenter - barWidth - 2}
                y={chartHeight - incomeBarHeight}
                width={barWidth}
                height={Math.max(incomeBarHeight, 2)}
                fill={theme.colors.income}
                rx={3}
              />
              {/* Expense bar */}
              <Rect
                x={groupCenter + 2}
                y={chartHeight - expenseBarHeight}
                width={barWidth}
                height={Math.max(expenseBarHeight, 2)}
                fill={theme.colors.expense}
                rx={3}
              />
              {/* Day label */}
              <SvgText
                x={groupCenter}
                y={height - 6}
                fill={theme.colors.textMuted}
                fontSize={11}
                textAnchor="middle"
              >
                {d.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
