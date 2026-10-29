import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "@design";
import { Text, Icon, Badge } from "../../../components";
import type { Receipt } from "@shared/entities";

export type ReceiptImageViewerProps = {
  receipt: Receipt;
};

export const ReceiptImageViewer: React.FC<ReceiptImageViewerProps> = ({ receipt }) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get("window").width;

  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.0));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const formattedAmount = receipt.amount_minor
    ? `KES ${(receipt.amount_minor / 100).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "KES 0.00";

  return (
    <View style={styles.container}>
      {/* Zoom Control Toolbar */}
      <View style={[styles.toolbar, { backgroundColor: theme.colors.surfaceAlt }]}>
        <View style={styles.zoomInfo}>
          <Icon name="search" size={14} color={theme.colors.textMuted} />
          <Text variant="caption" color="textMuted">
            {`${Math.round(zoomLevel * 100)}%`}
          </Text>
        </View>

        <View style={styles.toolbarButtons}>
          <TouchableOpacity
            onPress={handleZoomOut}
            style={[styles.toolBtn, { backgroundColor: theme.colors.surface }]}
            activeOpacity={0.7}
          >
            <Icon name="remove" size={16} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleResetZoom}
            style={[styles.toolBtn, { backgroundColor: theme.colors.surface }]}
            activeOpacity={0.7}
          >
            <Text variant="captionStrong" color="text">
              1:1
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleZoomIn}
            style={[styles.toolBtn, { backgroundColor: theme.colors.surface }]}
            activeOpacity={0.7}
          >
            <Icon name="add" size={16} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Pannable & Zoomable Receipt Mockup Canvas */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollCanvas}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.verticalCanvas}
        >
          <View
            style={[
              styles.receiptPaper,
              {
                width: (screenWidth - 48) * zoomLevel,
                transform: [{ scale: 1 }],
              },
            ]}
          >
            {/* Top serrated / receipt jagged top */}
            <View style={styles.serratedRow}>
              {[...Array(16)].map((_, i) => (
                <View key={i} style={styles.serratedTooth} />
              ))}
            </View>

            {/* Receipt Body */}
            <View style={styles.paperContent}>
              {/* Header */}
              <View style={styles.receiptHeader}>
                <Text style={styles.monoTitle}>
                  {(receipt.merchant || "MERCHANT RECEIPT").toUpperCase()}
                </Text>
                <Text style={styles.monoSub}>OFFLINE LOCAL SLIP</Text>
                <Text style={styles.monoSub}>
                  {receipt.occurred_at
                    ? new Date(receipt.occurred_at).toLocaleString()
                    : new Date().toLocaleString()}
                </Text>
              </View>

              <View style={styles.receiptDashedLine} />

              {/* Items List */}
              <View style={styles.itemsList}>
                {receipt.items && receipt.items.length > 0 ? (
                  receipt.items.map((it, idx) => (
                    <View key={it.id || idx} style={styles.itemRow}>
                      <Text style={styles.monoItemName} numberOfLines={1}>
                        {`${it.quantity ?? 1}x ${it.name}`}
                      </Text>
                      <Text style={styles.monoItemPrice}>
                        {it.unit_price_minor
                          ? ((it.unit_price_minor * (it.quantity ?? 1)) / 100).toFixed(2)
                          : "0.00"}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.itemRow}>
                    <Text style={styles.monoItemName}>General Goods & Services</Text>
                    <Text style={styles.monoItemPrice}>
                      {receipt.amount_minor ? (receipt.amount_minor / 100).toFixed(2) : "0.00"}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.receiptDashedLine} />

              {/* Totals */}
              <View style={styles.totalRow}>
                <Text style={styles.monoTotalLabel}>TOTAL</Text>
                <Text style={styles.monoTotalVal}>{formattedAmount}</Text>
              </View>

              <View style={styles.receiptDashedLine} />

              {/* Simulated Barcode */}
              <View style={styles.barcodeBox}>
                <View style={styles.barcodeLines}>
                  {[3, 1, 4, 1, 2, 5, 2, 1, 3, 2, 4, 1, 5, 2, 1, 3, 4, 2].map((w, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.barcodeBar,
                        { width: w, marginHorizontal: 1 },
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.barcodeText}>
                  {`*${receipt.id.toUpperCase()}*`}
                </Text>
              </View>
            </View>

            {/* Bottom serrated */}
            <View style={[styles.serratedRow, { transform: [{ rotate: "180deg" }] }]}>
              {[...Array(16)].map((_, i) => (
                <View key={i} style={styles.serratedTooth} />
              ))}
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 4,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  zoomInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  toolbarButtons: {
    flexDirection: "row",
    gap: 8,
  },
  toolBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollCanvas: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 12,
  },
  verticalCanvas: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  receiptPaper: {
    backgroundColor: "#FAF9F6", // Warm receipt paper off-white
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  serratedRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    overflow: "hidden",
    height: 6,
  },
  serratedTooth: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#FAF9F6",
  },
  paperContent: {
    padding: 16,
  },
  receiptHeader: {
    alignItems: "center",
    gap: 2,
    marginBottom: 10,
  },
  monoTitle: {
    fontFamily: "monospace",
    fontSize: 15,
    fontWeight: "bold",
    color: "#1E1E1E",
    textAlign: "center",
  },
  monoSub: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "#555555",
    textAlign: "center",
  },
  receiptDashedLine: {
    borderStyle: "dashed",
    borderWidth: 0.8,
    borderColor: "#AAAAAA",
    marginVertical: 10,
  },
  itemsList: {
    gap: 6,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  monoItemName: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#222222",
    flex: 1,
    marginRight: 8,
  },
  monoItemPrice: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#222222",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  monoTotalLabel: {
    fontFamily: "monospace",
    fontSize: 16,
    fontWeight: "bold",
    color: "#111111",
  },
  monoTotalVal: {
    fontFamily: "monospace",
    fontSize: 16,
    fontWeight: "bold",
    color: "#111111",
  },
  barcodeBox: {
    alignItems: "center",
    marginTop: 14,
    gap: 4,
  },
  barcodeLines: {
    flexDirection: "row",
    height: 36,
    alignItems: "stretch",
  },
  barcodeBar: {
    backgroundColor: "#1A1A1A",
  },
  barcodeText: {
    fontFamily: "monospace",
    fontSize: 10,
    color: "#555555",
  },
});

export default ReceiptImageViewer;
