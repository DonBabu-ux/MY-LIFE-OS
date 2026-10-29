import React from "react";
import { View, StyleSheet, ScrollView, type ViewStyle } from "react-native";
import { useTheme } from "@design";
import { Text } from "../primitives/Text";
import { Divider } from "../primitives/Divider";

export type ColumnDef<T> = {
  key: string;
  header: string;
  width?: number | string;
  align?: "left" | "center" | "right";
  render?: (item: T, index: number) => React.ReactNode;
};

export type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  style?: ViewStyle;
};

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  style,
}: DataTableProps<T>): React.ReactElement {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.table,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.md,
        },
        style,
      ]}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header Row */}
          <View style={[styles.row, styles.headerRow, { backgroundColor: theme.colors.surfaceElevated }]}>
            {columns.map((col) => (
              <View
                key={col.key}
                style={[
                  styles.cell,
                  typeof col.width === "number" ? { width: col.width } : { flex: 1, minWidth: 100 },
                ]}
              >
                <Text
                  variant="captionStrong"
                  color="textMuted"
                  align={col.align ?? "left"}
                >
                  {col.header}
                </Text>
              </View>
            ))}
          </View>

          <Divider />

          {/* Data Rows */}
          {data.map((item, rowIdx) => (
            <React.Fragment key={keyExtractor(item, rowIdx)}>
              <View
                style={[
                  styles.row,
                  rowIdx % 2 === 1 && { backgroundColor: theme.colors.surfaceMuted },
                ]}
              >
                {columns.map((col) => {
                  const cellContent = col.render
                    ? col.render(item, rowIdx)
                    : String((item as Record<string, unknown>)[col.key] ?? "");

                  return (
                    <View
                      key={col.key}
                      style={[
                        styles.cell,
                        typeof col.width === "number" ? { width: col.width } : { flex: 1, minWidth: 100 },
                      ]}
                    >
                      {typeof cellContent === "string" ? (
                        <Text variant="body" color="text" align={col.align ?? "left"}>
                          {cellContent}
                        </Text>
                      ) : (
                        cellContent
                      )}
                    </View>
                  );
                })}
              </View>
              {rowIdx < data.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRow: {
    paddingVertical: 10,
  },
  cell: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
  },
});
