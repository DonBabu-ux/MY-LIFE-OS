import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { useTheme } from "@design";
import { Text, Button, Icon, Input } from "../../../components";

export type AddItemSheetProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: {
    name: string;
    quantity: number;
    unit: string;
    estimated_price_minor?: number;
    priority: number;
  }) => void;
};

export const AddItemSheet: React.FC<AddItemSheetProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const theme = useTheme();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("pcs");
  const [priceStr, setPriceStr] = useState("");
  const [priority, setPriority] = useState<number>(2); // 1 = High, 2 = Medium, 3 = Low

  const units = ["pcs", "kg", "pack", "bottle", "bag", "tray", "box"];

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleSubmit = () => {
    if (!name.trim()) return;

    const parsedPrice = parseFloat(priceStr);
    const estimated_price_minor = !isNaN(parsedPrice) && parsedPrice > 0
      ? Math.round(parsedPrice * 100)
      : undefined;

    onAdd({
      name: name.trim(),
      quantity,
      unit,
      estimated_price_minor,
      priority,
    });

    // Reset fields
    setName("");
    setQuantity(1);
    setPriceStr("");
    setPriority(2);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
        <View style={[styles.sheetContainer, { backgroundColor: theme.colors.surface }]}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text variant="h3">Add Shopping Item</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon name="close" size={22} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Item Name */}
            <Input
              label="Item Name"
              placeholder="e.g. Fresh Milk, Basmati Rice, USB Cable..."
              value={name}
              onChangeText={setName}
              autoFocus
              containerStyle={{ marginBottom: 14 }}
            />

            {/* Quantity Stepper & Unit */}
            <View style={styles.rowFields}>
              <View style={{ flex: 1 }}>
                <Text variant="captionStrong" color="textMuted" style={{ marginBottom: 6 }}>
                  Quantity
                </Text>
                <View style={[styles.stepperContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceAlt }]}>
                  <TouchableOpacity
                    onPress={handleDecrement}
                    style={styles.stepperBtn}
                    activeOpacity={0.7}
                  >
                    <Icon name="remove" size={16} color={theme.colors.text} />
                  </TouchableOpacity>
                  <Text variant="h3" color="text" style={styles.stepperValue}>
                    {quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={handleIncrement}
                    style={styles.stepperBtn}
                    activeOpacity={0.7}
                  >
                    <Icon name="add" size={16} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Input
                  label="Estimated Unit Price"
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={priceStr}
                  onChangeText={setPriceStr}
                />
              </View>
            </View>

            {/* Unit Selector Chips */}
            <Text variant="captionStrong" color="textMuted" style={{ marginTop: 12, marginBottom: 6 }}>
              Unit of Measurement
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.unitsScroll}>
              {units.map((u) => {
                const isSelected = unit === u;
                return (
                  <TouchableOpacity
                    key={u}
                    activeOpacity={0.7}
                    onPress={() => setUnit(u)}
                    style={[
                      styles.unitChip,
                      {
                        backgroundColor: isSelected ? theme.colors.accentSubtle : theme.colors.surfaceAlt,
                        borderColor: isSelected ? theme.colors.accent : theme.colors.border,
                      },
                    ]}
                  >
                    <Text variant="captionStrong" color={isSelected ? "accent" : "textMuted"}>
                      {u}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Priority Selector */}
            <Text variant="captionStrong" color="textMuted" style={{ marginTop: 14, marginBottom: 6 }}>
              Priority Level
            </Text>
            <View style={styles.priorityRow}>
              {[
                { level: 1, label: "High", color: theme.colors.danger },
                { level: 2, label: "Medium", color: theme.colors.warning },
                { level: 3, label: "Low", color: theme.colors.accent },
              ].map((p) => {
                const isSelected = priority === p.level;
                return (
                  <TouchableOpacity
                    key={p.level}
                    activeOpacity={0.7}
                    onPress={() => setPriority(p.level)}
                    style={[
                      styles.priorityChip,
                      {
                        backgroundColor: isSelected ? `${p.color}20` : theme.colors.surfaceAlt,
                        borderColor: isSelected ? p.color : theme.colors.border,
                      },
                    ]}
                  >
                    <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
                    <Text variant="captionStrong" color={isSelected ? "text" : "textMuted"}>
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Add Button */}
            <Button
              label="Add to List"
              variant="primary"
              size="lg"
              disabled={!name.trim()}
              onPress={handleSubmit}
              style={{ marginTop: 20 }}
              fullWidth
            />
          </ScrollView>
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
    maxHeight: "85%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  rowFields: {
    flexDirection: "row",
    gap: 12,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperValue: {
    fontWeight: "700",
  },
  unitsScroll: {
    gap: 8,
  },
  unitChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  priorityRow: {
    flexDirection: "row",
    gap: 10,
  },
  priorityChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default AddItemSheet;
