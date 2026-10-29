/**
 * LocationToggle — UI only, permission-aware component.
 * Allows toggling background location tracking for activity routes.
 * Batch 10.3
 */

import React, { useState } from "react";
import { View, StyleSheet, Switch, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "@design";
import { Card, Text, Icon, Badge } from "../../../components";
import { useActivityStore } from "../state/activitySlice";

interface LocationToggleProps {
  compact?: boolean;
}

export const LocationToggle: React.FC<LocationToggleProps> = ({ compact = false }) => {
  const theme = useTheme();
  const isEnabled = useActivityStore((s) => s.isLocationEnabled);
  const toggleLocation = useActivityStore((s) => s.toggleLocation);

  const [permissionStatus, setPermissionStatus] = useState<"granted" | "denied">("granted");

  const handleToggle = (value: boolean) => {
    if (value && permissionStatus === "denied") {
      Alert.alert(
        "Location Permission",
        "Activity tracking requires location access for route and distance calculation. Would you like to enable it?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Allow Location",
            onPress: () => {
              setPermissionStatus("granted");
              toggleLocation(true);
            },
          },
        ]
      );
      return;
    }
    toggleLocation(value);
  };

  if (compact) {
    return (
      <View style={styles.compactRow}>
        <View style={styles.compactLeft}>
          <Icon
            name={isEnabled ? "navigate" : "navigate-outline"}
            size={18}
            color={isEnabled ? theme.colors.accent : theme.colors.textMuted}
          />
          <Text variant="captionStrong" color={isEnabled ? "text" : "textMuted"}>
            GPS Route Tracking
          </Text>
        </View>
        <Switch
          value={isEnabled}
          onValueChange={handleToggle}
          trackColor={{
            false: theme.colors.surfaceAlt,
            true: theme.colors.accent,
          }}
          thumbColor="#FFFFFF"
        />
      </View>
    );
  }

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isEnabled
                ? `${theme.colors.accent}18`
                : theme.colors.surfaceAlt,
            },
          ]}
        >
          <Icon
            name={isEnabled ? "navigate" : "navigate-outline"}
            size={22}
            color={isEnabled ? theme.colors.accent : theme.colors.textMuted}
          />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.titleLine}>
            <Text variant="bodyStrong" color="text">
              Location Services
            </Text>
            <Badge
              label={isEnabled ? "GPS Ready" : "Off"}
              variant={isEnabled ? "success" : "neutral"}
              size="small"
            />
          </View>
          <Text variant="caption" color="textMuted" style={{ marginTop: 2 }}>
            Enhances route accuracy & distance metrics
          </Text>
        </View>

        <Switch
          value={isEnabled}
          onValueChange={handleToggle}
          trackColor={{
            false: theme.colors.surfaceAlt,
            true: theme.colors.accent,
          }}
          thumbColor="#FFFFFF"
        />
      </View>

      {isEnabled && (
        <View style={styles.infoRow}>
          <Icon name="battery-charging-outline" size={14} color={theme.colors.success} />
          <Text variant="caption" color="textSubtle" style={{ fontSize: 11 }}>
            Battery optimized • Updates only while actively moving
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 16,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(150, 150, 150, 0.15)",
  },
  compactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  compactLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
