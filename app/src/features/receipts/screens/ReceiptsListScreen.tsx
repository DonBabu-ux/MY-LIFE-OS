import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@design";
import {
  Screen,
  Header,
  Text,
  Chip,
  Icon,
  EmptyState,
  Button,
  Badge,
  useToast,
} from "../../../components";
import { Routes } from "../../../navigation/routes";
import { useReceiptsStore } from "../state/receiptsSlice";
import { ReceiptThumbnail } from "../components/ReceiptThumbnail";
import { DuplicateReview } from "../components/DuplicateReview";

export const ReceiptsListScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { show: showToast } = useToast();

  const [refreshing, setRefreshing] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const viewMode = useReceiptsStore((state) => state.viewMode);
  const setViewMode = useReceiptsStore((state) => state.setViewMode);
  const filter = useReceiptsStore((state) => state.filter);
  const setFilter = useReceiptsStore((state) => state.setFilter);
  const resetFilter = useReceiptsStore((state) => state.resetFilter);
  const getFilteredReceipts = useReceiptsStore((state) => state.getFilteredReceipts);
  const activeDuplicate = useReceiptsStore((state) => state.activeDuplicate);
  const resolveDuplicate = useReceiptsStore((state) => state.resolveDuplicate);

  const receipts = getFilteredReceipts();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }, []);

  const handleResolveDuplicate = (action: "keep_both" | "merge" | "ignore") => {
    resolveDuplicate(action);
    setShowDuplicateModal(false);
    if (action === "merge") {
      showToast("Duplicate merged into single receipt", "success");
    } else if (action === "keep_both") {
      showToast("Both receipts kept as distinct", "neutral");
    } else {
      showToast("Duplicate dismissed", "neutral");
    }
  };

  const categoryFilters = [
    { label: "All", categoryId: undefined },
    { label: "Groceries", categoryId: "cat-2" },
    { label: "Dining", categoryId: "cat-1" },
    { label: "Fuel", categoryId: "cat-3" },
    { label: "Health", categoryId: "cat-6" },
  ];

  return (
    <Screen style={styles.container}>
      {/* Header */}
      <Header
        title="Receipts"
        subtitle={`${receipts.length} stored locally`}
        showBack
        right={
          <View style={styles.headerRightRow}>
            {/* Grid / List Toggle */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              style={[styles.modeToggleBtn, { backgroundColor: theme.colors.surfaceAlt }]}
            >
              <Icon
                name={viewMode === "grid" ? "list-outline" : "grid-outline"}
                size={18}
                color={theme.colors.text}
              />
            </TouchableOpacity>

            {/* Scan / Import Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(Routes.ReceiptImport)}
              style={[styles.headerAddBtn, { backgroundColor: theme.colors.accent }]}
            >
              <Icon name="scan-outline" size={18} color={theme.colors.onAccent} />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Duplicate Alert Banner */}
      {activeDuplicate && (
        <View style={styles.bannerWrapper}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowDuplicateModal(true)}
            style={[
              styles.duplicateBanner,
              {
                backgroundColor: `${theme.colors.warning}15`,
                borderColor: theme.colors.warning,
              },
            ]}
          >
            <View style={styles.bannerLeft}>
              <Icon name="copy-outline" size={20} color={theme.colors.warning} />
              <View style={{ flex: 1 }}>
                <Text variant="captionStrong" color="text">
                  Duplicate Receipt Detected
                </Text>
                <Text variant="caption" color="textMuted" numberOfLines={1}>
                  {activeDuplicate.reason}
                </Text>
              </View>
            </View>
            <Badge label="Review" tone="warning" />
          </TouchableOpacity>
        </View>
      )}

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Icon name="search" size={18} color={theme.colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search merchant, item, or OCR text..."
            placeholderTextColor={theme.colors.textSubtle}
            value={filter.search}
            onChangeText={(text) => setFilter({ search: text })}
          />
          {filter.search.length > 0 && (
            <TouchableOpacity onPress={() => setFilter({ search: "" })}>
              <Icon name="close-circle" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter Chips */}
      <View style={styles.filtersSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {categoryFilters.map((cat) => {
            const isSelected = filter.categoryId === cat.categoryId;
            return (
              <Chip
                key={cat.label}
                label={cat.label}
                selected={isSelected}
                onPress={() => setFilter({ categoryId: cat.categoryId })}
              />
            );
          })}

          <View style={styles.chipDivider} />

          <Chip
            label="This Month"
            selected={filter.dateRange === "month"}
            onPress={() =>
              setFilter({
                dateRange: filter.dateRange === "month" ? "all" : "month",
              })
            }
          />
        </ScrollView>
      </View>

      {/* Receipts Gallery / List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
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
        {receipts.length === 0 ? (
          <EmptyState
            icon={<Icon name="receipt-outline" size={48} color={theme.colors.textMuted} />}
            title="No Receipts Found"
            description={
              filter.search || filter.categoryId || filter.dateRange !== "all"
                ? "Try clearing active filters to see all stored receipts."
                : "Scan paper receipts or import PDF slips to extract items and keep your local archive."
            }
            action={
              filter.search || filter.categoryId || filter.dateRange !== "all" ? (
                <Button label="Clear Filters" variant="secondary" onPress={resetFilter} />
              ) : (
                <Button
                  label="Scan Receipt"
                  variant="primary"
                  onPress={() => navigation.navigate(Routes.ReceiptImport)}
                />
              )
            }
          />
        ) : viewMode === "grid" ? (
          <View style={styles.gridContainer}>
            {receipts.map((rec) => (
              <ReceiptThumbnail
                key={rec.id}
                receipt={rec}
                viewMode="grid"
                onPress={() =>
                  navigation.navigate(Routes.ReceiptDetail, { id: rec.id })
                }
              />
            ))}
          </View>
        ) : (
          <View style={styles.listViewContainer}>
            {receipts.map((rec) => (
              <ReceiptThumbnail
                key={rec.id}
                receipt={rec}
                viewMode="list"
                onPress={() =>
                  navigation.navigate(Routes.ReceiptDetail, { id: rec.id })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate(Routes.ReceiptImport)}
        style={[styles.fab, { backgroundColor: theme.colors.accent }]}
      >
        <Icon name="camera" size={26} color={theme.colors.onAccent} />
      </TouchableOpacity>

      {/* Duplicate Review Modal */}
      {activeDuplicate && (
        <DuplicateReview
          visible={showDuplicateModal}
          duplicateCandidate={activeDuplicate}
          onClose={() => setShowDuplicateModal(false)}
          onResolve={handleResolveDuplicate}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modeToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAddBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerWrapper: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
  duplicateBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  bannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
  },
  filtersSection: {
    paddingVertical: 6,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  chipDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(150,150,150,0.3)",
    marginHorizontal: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  listViewContainer: {
    gap: 2,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default ReceiptsListScreen;
