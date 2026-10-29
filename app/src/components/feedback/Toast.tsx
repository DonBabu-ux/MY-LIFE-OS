import React, { createContext, useCallback, useContext, useState } from "react";
import { View } from "react-native";
import { useTheme } from "@design";
import { Text } from "@components/primitives";

export type ToastTone = "neutral" | "success" | "danger";
type ToastMessage = { id: number; text: string; tone: ToastTone };

type ToastContextValue = {
  show: (text: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue>({ show: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const show = useCallback((text: string, tone: ToastTone = "neutral") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          alignItems: "center",
          gap: theme.spacing.sm,
        }}
      >
        {toasts.map((t) => (
          <View
            key={t.id}
            style={{
              backgroundColor:
                t.tone === "success" ? theme.colors.success :
                t.tone === "danger"  ? theme.colors.danger  :
                theme.colors.surfaceAlt,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.radii.md,
              maxWidth: "90%",
            }}
          >
            <Text variant="captionStrong" style={{ color: theme.colors.onAccent }}>
              {t.text}
            </Text>
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
};

