import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider, useTheme } from "@design";
import { ToastProvider } from "@components/feedback";
import { RootNavigator } from "@navigation/RootNavigator";
import { linking } from "@navigation/linking";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

const ThemedShell: React.FC = () => {
  const theme = useTheme();
  return (
    <>
      <StatusBar
        barStyle={theme.scheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.bg}
      />
      <NavigationContainer linking={linking}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ToastProvider>
              <ThemedShell />
            </ToastProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
