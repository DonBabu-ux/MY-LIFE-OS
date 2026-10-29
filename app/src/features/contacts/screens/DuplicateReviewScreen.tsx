/**
 * DuplicateReviewScreen — Intelligent Contact Deduplication & Merge.
 * Features:
 *  - Displays detected candidate pairs with match score & match reason
 *  - Comparison view of Contact A vs Contact B
 *  - One-tap merge actions (Keep A as primary vs Keep B as primary)
 *  - Dismiss option (keep both separate)
 *  - Celebratory empty state when all duplicates are resolved
 * Batch 11.3
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
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
  Button,
  Divider,
} from "../../../components";
import { useContactsStore } from "../state/contactsSlice";
import { type DuplicatePair, type Contact } from "../mock";

export const DuplicateReviewScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const duplicatePairs = useContactsStore((s) => s.duplicatePairs);
  const mergeDuplicates = useContactsStore((s) => s.mergeDuplicates);
  const dismissDuplicate = useContactsStore((s) => s.dismissDuplicate);

  const [resolvedMessage, setResolvedMessage] = useState<string | null>(null);

  const handleMerge = (pair: DuplicatePair, primaryContact: Contact, secondaryContact: Contact) => {
    Alert.alert(
      "Confirm Merge",
      `Merge ${secondaryContact.firstName} into ${primaryContact.firstName}? All unique phone numbers, emails, notes, and labels will be combined.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Merge Contacts",
          style: "default",
          onPress: () => {
            mergeDuplicates(pair.id, primaryContact.id);
            setResolvedMessage(`Merged into ${primaryContact.firstName} ${primaryContact.lastName}`);
            setTimeout(() => setResolvedMessage(null), 3000);
          },
        },
      ]
    );
  };

  const handleDismiss = (pair: DuplicatePair) => {
    dismissDuplicate(pair.id);
    setResolvedMessage("Pair dismissed. Contacts kept separate.");
    setTimeout(() => setResolvedMessage(null), 3000);
  };

  return (
    <Screen style={styles.screen}>
      <Header title="Duplicate Review" subtitle="Contact Hygiene" showBack />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Toast Message */}
        {resolvedMessage && (
          <View
            style={[
              styles.toastBanner,
              { backgroundColor: `${theme.colors.success}20`, borderColor: theme.colors.success },
            ]}
          >
            <Icon name="checkmark-circle" size={18} color={theme.colors.success} />
            <Text variant="captionStrong" style={{ color: theme.colors.success }}>
              {resolvedMessage}
            </Text>
          </View>
        )}

        {duplicatePairs.length === 0 ? (
          /* Empty / Resolved State */
          <Card style={styles.emptyCard}>
            <View
              style={[
                styles.emptyIconWrap,
                { backgroundColor: `${theme.colors.success}18` },
              ]}
            >
              <Icon
                name="checkmark-done-circle"
                size={56}
                color={theme.colors.success}
              />
            </View>
            <Text variant="headline" color="text" style={{ marginTop: 16 }}>
              No Duplicates Found
            </Text>
            <Text
              variant="body"
              color="textMuted"
              style={{ textAlign: "center", marginTop: 6, paddingHorizontal: 16 }}
            >
              Your contact book is completely clean. We will notify you if any overlapping contacts are detected.
            </Text>
            <Button
              title="Return to Contacts"
              variant="primary"
              onPress={() => navigation.goBack()}
              style={{ marginTop: 24 }}
            />
          </Card>
        ) : (
          <>
            {/* Explanatory Header Card */}
            <Card style={styles.summaryCard}>
              <View style={styles.summaryTop}>
                <View
                  style={[
                    styles.summaryIcon,
                    { backgroundColor: `${theme.colors.accent}18` },
                  ]}
                >
                  <Icon name="git-merge-outline" size={22} color={theme.colors.accent} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text variant="bodyStrong" color="text">
                    {duplicatePairs.length} Candidate Pair{duplicatePairs.length === 1 ? "" : "s"} Detected
                  </Text>
                  <Text variant="caption" color="textMuted">
                    Review and combine contact details without losing data
                  </Text>
                </View>
              </View>
            </Card>

            {/* List of Candidate Duplicate Pairs */}
            {duplicatePairs.map((pair) => {
              const a = pair.contactA;
              const b = pair.contactB;

              return (
                <Card key={pair.id} style={styles.pairCard}>
                  {/* Pair Header with Match Score */}
                  <View style={styles.pairHeader}>
                    <View style={styles.reasonCol}>
                      <View style={styles.badgeRow}>
                        <Badge
                          label={`${pair.matchScore}% Match`}
                          variant="accent"
                          size="small"
                        />
                      </View>
                      <Text variant="caption" color="textMuted" style={{ marginTop: 4 }}>
                        {pair.matchReason}
                      </Text>
                    </View>
                  </View>

                  <Divider style={styles.pairDivider} />

                  {/* Contact A Preview */}
                  <View
                    style={[
                      styles.contactBox,
                      { backgroundColor: theme.colors.surfaceAlt },
                    ]}
                  >
                    <View style={styles.contactTopRow}>
                      <View
                        style={[
                          styles.contactAvatar,
                          { backgroundColor: a.avatarColor || theme.colors.accent },
                        ]}
                      >
                        <Text variant="captionStrong" style={{ color: "#FFF" }}>
                          {a.firstName.charAt(0)}{a.lastName.charAt(0)}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text variant="bodyStrong" color="text">
                          {a.firstName} {a.lastName}
                        </Text>
                        <Text variant="caption" color="textMuted">
                          {a.jobTitle ? `${a.jobTitle} • ` : ""}{a.organization || "No org"}
                        </Text>
                      </View>
                      <Badge label="Card A" variant="neutral" size="small" />
                    </View>

                    <View style={styles.contactMeta}>
                      <Text variant="caption" color="textMuted">
                        📞 {a.phones.map((p) => p.number).join(", ") || "No phone"}
                      </Text>
                      <Text variant="caption" color="textMuted">
                        ✉️ {a.emails.map((e) => e.address).join(", ") || "No email"}
                      </Text>
                    </View>
                  </View>

                  {/* VS Indicator */}
                  <View style={styles.vsRow}>
                    <View style={[styles.vsLine, { backgroundColor: theme.colors.border }]} />
                    <View
                      style={[
                        styles.vsCircle,
                        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                      ]}
                    >
                      <Text variant="captionStrong" color="textMuted" style={{ fontSize: 10 }}>
                        VS
                      </Text>
                    </View>
                    <View style={[styles.vsLine, { backgroundColor: theme.colors.border }]} />
                  </View>

                  {/* Contact B Preview */}
                  <View
                    style={[
                      styles.contactBox,
                      { backgroundColor: theme.colors.surfaceAlt },
                    ]}
                  >
                    <View style={styles.contactTopRow}>
                      <View
                        style={[
                          styles.contactAvatar,
                          { backgroundColor: b.avatarColor || theme.colors.accent },
                        ]}
                      >
                        <Text variant="captionStrong" style={{ color: "#FFF" }}>
                          {b.firstName.charAt(0)}{b.lastName.charAt(0)}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text variant="bodyStrong" color="text">
                          {b.firstName} {b.lastName}
                        </Text>
                        <Text variant="caption" color="textMuted">
                          {b.jobTitle ? `${b.jobTitle} • ` : ""}{b.organization || "No org"}
                        </Text>
                      </View>
                      <Badge label="Card B" variant="neutral" size="small" />
                    </View>

                    <View style={styles.contactMeta}>
                      <Text variant="caption" color="textMuted">
                        📞 {b.phones.map((p) => p.number).join(", ") || "No phone"}
                      </Text>
                      <Text variant="caption" color="textMuted">
                        ✉️ {b.emails.map((e) => e.address).join(", ") || "No email"}
                      </Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtonsCol}>
                    <Button
                      title={`Keep "${a.firstName}" & Merge Details`}
                      variant="primary"
                      onPress={() => handleMerge(pair, a, b)}
                    />
                    <Button
                      title={`Keep "${b.firstName}" & Merge Details`}
                      variant="secondary"
                      onPress={() => handleMerge(pair, b, a)}
                    />
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleDismiss(pair)}
                      style={styles.dismissBtn}
                    >
                      <Text variant="captionStrong" color="textMuted">
                        Keep Both Separate
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              );
            })}
          </>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  toastBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  emptyCard: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCard: {
    padding: 16,
    borderRadius: 16,
  },
  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryInfo: {
    flex: 1,
  },
  pairCard: {
    padding: 16,
    borderRadius: 16,
  },
  pairHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  reasonCol: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: "row",
  },
  pairDivider: {
    marginVertical: 14,
  },
  contactBox: {
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  contactTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  contactAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  contactMeta: {
    gap: 3,
    paddingLeft: 46,
  },
  vsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  vsLine: {
    flex: 1,
    height: 1,
  },
  vsCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  actionButtonsCol: {
    gap: 10,
    marginTop: 16,
  },
  dismissBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
});
