import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@design";
import { Screen, Header, Badge, Skeleton, Card, Icon } from "../../../components";
import { Routes } from "../../../navigation/routes";
import { mockDashboardData, type DashboardMockData } from "../mock";
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
          right={<Badge label="Offline" tone="neutral" />}
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
            <Badge label="Offline" tone="neutral" />
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
  },
  skeletonCard: {
    marginBottom: 12,
  },
});

export default DashboardScreen;
