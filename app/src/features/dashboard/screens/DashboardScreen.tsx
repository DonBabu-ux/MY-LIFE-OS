import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@design";
import { Screen, Header, Badge, Skeleton, Card, Icon, Text } from "../../../components";
import { Routes } from "../../../navigation/routes";
import { mockDashboardData, type DashboardMockData } from "../mock";
import { PermissionsModal } from "../../../permissions";
import { useSettingsStore } from "../../../state/settingsStore";
import {
  MoneySummaryCard,
  PlannerCard,
  UsageCard,
  ActivityCard,
  ShoppingCard,
  VaultCard,
} from "../components";

export const DashboardScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<DashboardMockData | null>(null);
  const [permissionsModalVisible, setPermissionsModalVisible] = useState(false);

  const hasPromptedPermissions = useSettingsStore((s) => s.hasPromptedPermissions);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(mockDashboardData);
      setLoading(false);
    }, 700); // Simulate initial loading skeleton

    return () => clearTimeout(timer);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setData({ ...mockDashboardData });
      setRefreshing(false);
    }, 800);
  }, []);

  if (loading || !data) {
    return (
      <Screen style={styles.container}>
        <Header
          title="Loading..."
          subtitle="Syncing local database"
          right={<Badge label="Offline" variant="neutral" size="small" />}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {[1, 2, 3, 4].map((key) => (
            <Card key={key} style={styles.skeletonCard} padding="md">
              <Skeleton width="40%" height={24} style={{ marginBottom: 12 }} />
              <Skeleton width="70%" height={36} style={{ marginBottom: 16 }} />
              <Skeleton width="100%" height={16} />
            </Card>
          ))}
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <Header
        title={data.greeting}
        subtitle={data.formattedDate}
        right={
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Badge label="Offline" variant="neutral" size="small" />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(Routes.Settings)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="settings-outline" size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent}
            colors={[theme.colors.accent]}
          />
        }
      >
        {/* Sovereign Permissions Prompt Banner */}
        {!hasPromptedPermissions && (
          <Card
            style={[
              styles.permissionBanner,
              { backgroundColor: `${theme.colors.accent}14`, borderColor: `${theme.colors.accent}40` },
            ]}
          >
            <View style={styles.permissionBannerRow}>
              <View style={[styles.permIconBox, { backgroundColor: theme.colors.accent }]}>
                <Icon name="shield-checkmark" size={20} color="#FFF" />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text variant="bodyStrong" style={{ color: theme.colors.text }}>
                    Setup App Permissions
                  </Text>
                  <Badge label="Required" variant="accent" size="small" />
                </View>
                <Text variant="caption" color="textMuted">
                  Grant camera, reminders & offline GPS to activate full OS features.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.permButton, { backgroundColor: theme.colors.accent }]}
              onPress={() => setPermissionsModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text variant="captionStrong" style={{ color: "#FFF" }}>
                Review & Grant Permissions ›
              </Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* 1. Money Card */}
        <MoneySummaryCard
          data={data.money}
          onPress={() => navigation.navigate(Routes.TabMoney)}
        />

        {/* 2. Planner Card */}
        <PlannerCard
          data={data.planner}
          onPress={() => navigation.navigate(Routes.TabPlan)}
        />

        {/* 3. Phone Usage Card */}
        <UsageCard
          data={data.phoneUsage}
          onPress={() => navigation.navigate(Routes.TabMore)}
        />

        {/* 4. Activity Card */}
        <ActivityCard
          data={data.activity}
          onPress={() =>
            navigation.navigate(Routes.TabMore, { screen: Routes.ActivityDashboard })
          }
        />

        {/* 5. Shopping Card */}
        <ShoppingCard
          data={data.shopping}
          onPress={() => navigation.navigate(Routes.TabMoney)}
        />

        {/* 6. Vault Card */}
        <VaultCard
          data={data.vault}
          onPress={() => navigation.navigate(Routes.TabVault)}
        />
      </ScrollView>

      {/* Permissions Modal */}
      <PermissionsModal
        visible={permissionsModalVisible}
        onClose={() => setPermissionsModalVisible(false)}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },
  skeletonCard: {
    marginBottom: 12,
  },
  permissionBanner: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  permissionBannerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  permIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  permButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
});

export default DashboardScreen;
