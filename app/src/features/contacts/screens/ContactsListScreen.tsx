/**
 * ContactsListScreen — Searchable, Alphabetical Contact Directory.
 * Features:
 *  - Alphabetical sections with avatar initials
 *  - Real-time search query filtering
 *  - Label / Starred filter chips
 *  - Inline favorite star toggling
 *  - Duplicate detection banner leading to DuplicateReviewScreen
 *  - Navigation to ContactDetailScreen
 * Batch 11.1
 */

import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@design";
import {
  Screen,
  Header,
  Card,
  Text,
  Icon,
  Badge,
  Divider,
} from "../../../components";
import { useContactsStore } from "../state/contactsSlice";
import { ALL_CONTACT_LABELS, type Contact } from "../mock";
import { Routes } from "../../../navigation/routes";

export const ContactsListScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const contacts = useContactsStore((s) => s.contacts);
  const duplicatePairs = useContactsStore((s) => s.duplicatePairs);
  const toggleStarred = useContactsStore((s) => s.toggleStarred);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("All");

  // Filtering
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
      const org = (c.organization || "").toLowerCase();
      const matchesSearch =
        searchQuery.trim() === "" ||
        fullName.includes(searchQuery.toLowerCase()) ||
        org.includes(searchQuery.toLowerCase()) ||
        c.phones.some((p) => p.number.includes(searchQuery)) ||
        c.emails.some((e) => e.address.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedLabel === "All") return true;
      if (selectedLabel === "Starred ⭐") return c.starred;
      return c.labels.includes(selectedLabel);
    });
  }, [contacts, searchQuery, selectedLabel]);

  // Alphabetical section grouping
  const sections = useMemo(() => {
    const sorted = [...filteredContacts].sort((a, b) =>
      a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)
    );

    const groups: Record<string, Contact[]> = {};
    sorted.forEach((c) => {
      const letter = (c.lastName || c.firstName).charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(c);
    });

    return Object.keys(groups)
      .sort()
      .map((letter) => ({
        title: letter,
        data: groups[letter],
      }));
  }, [filteredContacts]);

  const labelsWithStarred = ["All", "Starred ⭐", ...ALL_CONTACT_LABELS.filter((l) => l !== "All")];

  return (
    <Screen style={styles.screen}>
      <Header
        title="Contacts"
        subtitle={`${contacts.length} people`}
        rightAction={
          duplicatePairs.length > 0
            ? {
                icon: "people-circle-outline",
                onPress: () => navigation.navigate(Routes.DuplicateReview),
              }
            : undefined
        }
      />

      {/* Duplicate Review Banner Alert (if duplicates exist) */}
      {duplicatePairs.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate(Routes.DuplicateReview)}
          style={styles.bannerTouchable}
        >
          <View
            style={[
              styles.duplicateBanner,
              { backgroundColor: `${theme.colors.accent}15`, borderColor: theme.colors.accent },
            ]}
          >
            <View style={styles.bannerLeft}>
              <Icon name="copy-outline" size={18} color={theme.colors.accent} />
              <Text variant="captionStrong" color="accent">
                {duplicatePairs.length} Duplicate Contacts Found
              </Text>
            </View>
            <Text variant="captionStrong" color="accent">
              Review & Merge →
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.surfaceAlt,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Icon name="search-outline" size={18} color={theme.colors.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search name, company, email, phone..."
            placeholderTextColor={theme.colors.textSubtle}
            style={[styles.searchInput, { color: theme.colors.text }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Icon name="close-circle" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Chips Horizontal Bar */}
      <View style={styles.filterScroll}>
        <SectionList
          horizontal
          showsHorizontalScrollIndicator={false}
          sections={[{ title: "labels", data: labelsWithStarred }]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected = selectedLabel === item;
            return (
              <TouchableOpacity
                onPress={() => setSelectedLabel(item)}
                activeOpacity={0.7}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.accent
                      : theme.colors.surfaceAlt,
                    borderColor: isSelected
                      ? theme.colors.accent
                      : theme.colors.border,
                  },
                ]}
              >
                <Text
                  variant="captionStrong"
                  style={{
                    color: isSelected ? "#FFFFFF" : theme.colors.textMuted,
                    fontSize: 12,
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.filterChipList}
        />
      </View>

      {/* Alphabetical List */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text variant="captionStrong" color="accent" style={styles.sectionHeaderText}>
              {title}
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          const initials = `${item.firstName.charAt(0)}${item.lastName.charAt(0)}`;
          const primaryPhone = item.phones[0]?.number;
          const subtitle = item.organization
            ? `${item.jobTitle ? `${item.jobTitle} • ` : ""}${item.organization}`
            : primaryPhone || item.emails[0]?.address;

          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate(Routes.ContactDetail, { id: item.id })
              }
              style={[
                styles.contactRow,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              {/* Avatar Initials */}
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: item.avatarColor || theme.colors.accent },
                ]}
              >
                <Text variant="captionStrong" style={styles.avatarInitials}>
                  {initials}
                </Text>
              </View>

              {/* Name & Details */}
              <View style={styles.contactInfo}>
                <View style={styles.nameRow}>
                  <Text variant="bodyStrong" color="text">
                    {item.firstName} {item.lastName}
                  </Text>
                  {item.labels.slice(0, 1).map((lbl) => (
                    <Badge
                      key={lbl}
                      label={lbl}
                      variant="outline"
                      size="small"
                    />
                  ))}
                </View>

                {subtitle && (
                  <Text variant="caption" color="textMuted" numberOfLines={1}>
                    {subtitle}
                  </Text>
                )}
              </View>

              {/* Starred Button */}
              <TouchableOpacity
                onPress={() => toggleStarred(item.id)}
                style={styles.starBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon
                  name={item.starred ? "star" : "star-outline"}
                  size={18}
                  color={item.starred ? "#F59E0B" : theme.colors.textSubtle}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon
              name="search-outline"
              size={48}
              color={theme.colors.textSubtle}
            />
            <Text variant="title" color="text" style={{ marginTop: 12 }}>
              No Contacts Found
            </Text>
            <Text variant="caption" color="textMuted" style={{ marginTop: 4 }}>
              Try adjusting your search query or label filters
            </Text>
          </View>
        }
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  bannerTouchable: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  duplicateBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  bannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterScroll: {
    height: 38,
    marginBottom: 8,
  },
  filterChipList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    paddingVertical: 6,
    paddingTop: 12,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: "700",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarInitials: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  contactInfo: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  starBtn: {
    padding: 6,
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
});
