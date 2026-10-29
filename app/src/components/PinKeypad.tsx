/**
 * PinKeypad — Numeric PIN Entry Keypad with Biometrics and Indicator Dots.
 * Shared by LockScreen and OnboardingScreen.
 * Batch 12.4
 */

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@design";
import { Text } from "./primitives/Text";
import { Icon } from "./primitives/Icon";

interface PinKeypadProps {
  pin: string;
  maxDigits?: number;
  onDigit: (digit: string) => void;
  onDelete: () => void;
  onBiometric?: () => void;
  showBiometric?: boolean;
  error?: string | boolean;
}

export const PinKeypad: React.FC<PinKeypadProps> = ({
  pin,
  maxDigits = 4,
  onDigit,
  onDelete,
  onBiometric,
  showBiometric = false,
  error,
}) => {
  const theme = useTheme();

  const handleDigitPress = (digit: string) => {
    if (pin.length < maxDigits) {
      onDigit(digit);
    }
  };

  const dots = Array.from({ length: maxDigits });

  return (
    <View style={styles.container}>
      {/* PIN Dots Display */}
      <View style={styles.dotsRow}>
        {dots.map((_, idx) => {
          const filled = idx < pin.length;
          return (
            <View
              key={idx}
              style={[
                styles.dot,
                {
                  backgroundColor: error
                    ? theme.colors.error
                    : filled
                    ? theme.colors.accent
                    : "transparent",
                  borderColor: error
                    ? theme.colors.error
                    : filled
                    ? theme.colors.accent
                    : theme.colors.border,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Error Message */}
      {typeof error === "string" && error.length > 0 ? (
        <Text
          variant="captionStrong"
          style={{ color: theme.colors.error, textAlign: "center", marginBottom: 16 }}
        >
          {error}
        </Text>
      ) : (
        <View style={{ height: 24 }} />
      )}

      {/* Keypad Grid (3x4) */}
      <View style={styles.keypadGrid}>
        {/* Row 1 */}
        <View style={styles.keyRow}>
          {["1", "2", "3"].map((d) => (
            <TouchableOpacity
              key={d}
              activeOpacity={0.6}
              onPress={() => handleDigitPress(d)}
              style={[styles.keyBtn, { backgroundColor: theme.colors.surfaceAlt }]}
            >
              <Text variant="headline" color="text" style={styles.keyDigit}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Row 2 */}
        <View style={styles.keyRow}>
          {["4", "5", "6"].map((d) => (
            <TouchableOpacity
              key={d}
              activeOpacity={0.6}
              onPress={() => handleDigitPress(d)}
              style={[styles.keyBtn, { backgroundColor: theme.colors.surfaceAlt }]}
            >
              <Text variant="headline" color="text" style={styles.keyDigit}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Row 3 */}
        <View style={styles.keyRow}>
          {["7", "8", "9"].map((d) => (
            <TouchableOpacity
              key={d}
              activeOpacity={0.6}
              onPress={() => handleDigitPress(d)}
              style={[styles.keyBtn, { backgroundColor: theme.colors.surfaceAlt }]}
            >
              <Text variant="headline" color="text" style={styles.keyDigit}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Row 4: Biometric / 0 / Delete */}
        <View style={styles.keyRow}>
          {showBiometric && onBiometric ? (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={onBiometric}
              style={[styles.keyBtn, { backgroundColor: `${theme.colors.accent}15` }]}
            >
              <Icon name="finger-print-outline" size={28} color={theme.colors.accent} />
            </TouchableOpacity>
          ) : (
            <View style={styles.keyBtnSpacer} />
          )}

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleDigitPress("0")}
            style={[styles.keyBtn, { backgroundColor: theme.colors.surfaceAlt }]}
          >
            <Text variant="headline" color="text" style={styles.keyDigit}>
              0
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={onDelete}
            style={[styles.keyBtn, { backgroundColor: "transparent" }]}
          >
            <Icon name="backspace-outline" size={26} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  keypadGrid: {
    gap: 16,
    alignItems: "center",
  },
  keyRow: {
    flexDirection: "row",
    gap: 24,
  },
  keyBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  keyDigit: {
    fontSize: 26,
    fontWeight: "600",
  },
  keyBtnSpacer: {
    width: 68,
    height: 68,
  },
});
