import React from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { useTheme } from "@design";

export type ScreenProps = ViewProps & {
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  contentStyle?: ViewStyle;
  keyboardAvoid?: boolean;
};

export const Screen: React.FC<ScreenProps> = ({
  scroll = false,
  padded = true,
  edges = ["top", "bottom"],
  contentStyle,
  keyboardAvoid = false,
  style,
  children,
  ...rest
}) => {
  const theme = useTheme();

  const inner = scroll ? (
    <ScrollView
      contentContainerStyle={[
        { padding: padded ? theme.spacing.lg : 0 },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        { flex: 1, padding: padded ? theme.spacing.lg : 0 },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  const wrapped = keyboardAvoid ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      {inner}
    </KeyboardAvoidingView>
  ) : (
    inner
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[{ flex: 1, backgroundColor: theme.colors.bg }, style]}
      {...rest}
    >
      {wrapped}
    </SafeAreaView>
  );
};
