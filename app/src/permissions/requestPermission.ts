import { Platform } from "react-native";
import { useSettingsStore, type PermissionSettings } from "../state/settingsStore";

/**
 * Request system permissions on Web & Native with graceful fallbacks.
 */
export async function requestAppPermission(permission: keyof PermissionSettings): Promise<boolean> {
  const store = useSettingsStore.getState();

  try {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      switch (permission) {
        case "notifications": {
          if ("Notification" in window) {
            const result = await Notification.requestPermission();
            const granted = result === "granted";
            store.setPermission("notifications", granted);
            return granted;
          }
          break;
        }
        case "location": {
          if ("geolocation" in navigator) {
            return new Promise((resolve) => {
              navigator.geolocation.getCurrentPosition(
                () => {
                  store.setPermission("location", true);
                  resolve(true);
                },
                () => {
                  store.setPermission("location", false);
                  resolve(false);
                },
                { timeout: 8000 }
              );
            });
          }
          break;
        }
        case "camera": {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: true });
              stream.getTracks().forEach((track) => track.stop());
              store.setPermission("camera", true);
              return true;
            } catch {
              store.setPermission("camera", false);
              return false;
            }
          }
          break;
        }
        default:
          // Local sovereign simulated permissions (SMS, contacts, usage stats)
          store.setPermission(permission, true);
          return true;
      }
    }

    // Default for native / offline sovereign mock
    store.setPermission(permission, true);
    return true;
  } catch (err) {
    console.warn(`Failed to request permission ${permission}:`, err);
    store.setPermission(permission, false);
    return false;
  }
}
