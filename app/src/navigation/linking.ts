import type { LinkingOptions } from "@react-navigation/native";
import type { RootStackParamList } from "./types";

/**
 * Deep link config. `mylifeos://` URLs route to the correct screen.
 * Real routes will be filled in as modules come online.
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ["mylifeos://", "https://mylifeos.app"],
  config: {
    screens: {
      Lock: "lock",
      Onboarding: "onboarding",
      Main: {
        screens: {
          TabDashboard: "dashboard",
          TabMoney: "money",
          TabVault: "vault",
          TabPlan: "plan",
          TabMore: "more",
        },
      },
      Settings: "settings",
      NotFound: "*",
    },
  },
};
