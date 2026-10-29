/**
 * ContactDetailScreen — Full Contact Dossier & Associations.
 * Features:
 *  - Contact hero with large avatar & quick actions (call, message, email)
 *  - Phone numbers & email addresses
 *  - Labels & organization metadata
 *  - Notes & biography
 *  - Linked Notes & Linked Diary Entries
 *  - Star toggle & Delete contact
 * Batch 11.2
 */

import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import { useTheme } from "@design";
import {
  Screen,
  Header,
  Card,
  Text,
  Icon,
  Badge,
  Divider,
  Button,
} from "../../../components";
import { useContactsStore } from "../state/contactsSlice";
import type { MoreStackParamList } from "../../../navigation/types";

type DetailRoute = RouteProp<MoreStackParamList, "ContactDetail">;

export const ContactDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<DetailRoute>();
  const contactId = route.params?.id;

  const getContactById = useContactsStore((s) => s.getContactById);
  const toggleStarred = useContactsStore((s) => s.toggleStarred);
  const deleteContact = useContactsStore((s) => s.deleteContact);

  const contact = getContactById(contactId);

  if (!contact) {
    return (
      <Screen style={styles.screen}>
        <Header title="Contact" showBack />
        <View style={styles.notFound}>
          <Text variant="body" color="textMuted">
            Contact not found
          </Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 12 }}
          />
        </View>
      </Screen>
    );
  }

  const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;

  const handleDelete = () => {
    Alert.alert(
      "Delete Contact",
      `Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteContact(contact.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleAction = (type: string, target?: string) => {
    Alert.alert(type, target ? `${type}: ${target}` : `Simulating ${type}...`);
  };

  return (
    <Screen style={styles.screen}>
      <Header
        title={`${contact.firstName} ${contact.lastName}`}
        showBack
        rightAction={{
          icon: contact.starred ? "star" : "star-outline",
          onPress: () => toggleStarred(contact.id),
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Hero */}
        <Card style={styles.heroCard}>
          <View
            style={[
              styles.avatarLarge,
              { backgroundColor: contact.avatarColor || theme.colors.accent },
            ]}
          >
            <Text variant="display" style={styles.avatarInitials}>
              {initials}
            </Text>
          </View>

          <Text variant="title" color="text" style={styles.heroName}>
            {contact.firstName} {contact.lastName}
          </Text>

          {contact.organization && (
            <Text variant="caption" color="textMuted" style={styles.heroOrg}>
              {contact.jobTitle ? `${contact.jobTitle} • ` : ""}
              {contact.organization}
            </Text>
          )}

          {/* Label Badges */}
          {contact.labels.length > 0 && (
            <View style={styles.labelsRow}>
              {contact.labels.map((lbl) => (
                <Badge key={lbl} label={lbl} variant="outline" size="small" />
              ))}
            </View>
          )}

          <Divider style={styles.heroDivider} />

          {/* Quick Action Icons */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleAction("Call", contact.phones[0]?.number)}
              style={styles.quickActionBtn}
            >
              <View
                style={[
                  styles.actionIconCircle,
                  { backgroundColor: `${theme.colors.accent}18` },
                ]}
              >
                <Icon name="call" size={20} color={theme.colors.accent} />
              </View>
              <Text variant="captionStrong" color="accent">
                Call
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleAction("Message", contact.phones[0]?.number)}
              style={styles.quickActionBtn}
            >
              <View
                style={[
                  styles.actionIconCircle,
                  { backgroundColor: `${theme.colors.accent}18` },
                ]}
              >
                <Icon name="chatbubble" size={20} color={theme.colors.accent} />
              </View>
              <Text variant="captionStrong" color="accent">
                Message
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleAction("Email", contact.emails[0]?.address)}
              style={styles.quickActionBtn}
            >
              <View
                style={[
                  styles.actionIconCircle,
                  { backgroundColor: `${theme.colors.accent}18` },
                ]}
              >
                <Icon name="mail" size={20} color={theme.colors.accent} />
              </View>
              <Text variant="captionStrong" color="accent">
                Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleAction("Share Contact")}
              style={styles.quickActionBtn}
            >
              <View
                style={[
                  styles.actionIconCircle,
                  { backgroundColor: `${theme.colors.accent}18` },
                ]}
              >
                <Icon name="share-outline" size={20} color={theme.colors.accent} />
              </View>
              <Text variant="captionStrong" color="accent">
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Phones Card */}
        {contact.phones.length > 0 && (
          <Card style={styles.card}>
            <Text variant="captionStrong" color="textMuted" style={styles.cardHeader}>
              PHONE NUMBERS
            </Text>
            <View style={styles.dataList}>
              {contact.phones.map((p, idx) => (
                <View key={idx} style={styles.dataRow}>
                  <View style={styles.dataLeft}>
                    <Text variant="caption" color="textMuted" style={styles.labelCapital}>
                      {p.label}
                    </Text>
                    <Text variant="bodyStrong" color="text">
                      {p.number}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleAction("Call", p.number)}
                    style={styles.rowActionBtn}
                  >
                    <Icon name="call-outline" size={18} color={theme.colors.accent} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Emails Card */}
        {contact.emails.length > 0 && (
          <Card style={styles.card}>
            <Text variant="captionStrong" color="textMuted" style={styles.cardHeader}>
              EMAIL ADDRESSES
            </Text>
            <View style={styles.dataList}>
              {contact.emails.map((e, idx) => (
                <View key={idx} style={styles.dataRow}>
                  <View style={styles.dataLeft}>
                    <Text variant="caption" color="textMuted" style={styles.labelCapital}>
                      {e.label}
                    </Text>
                    <Text variant="bodyStrong" color="text">
                      {e.address}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleAction("Email", e.address)}
                    style={styles.rowActionBtn}
                  >
                    <Icon name="mail-outline" size={18} color={theme.colors.accent} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Notes Card */}
        {contact.notes && (
          <Card style={styles.card}>
            <Text variant="captionStrong" color="textMuted" style={styles.cardHeader}>
              NOTES
            </Text>
            <Text variant="body" color="text" style={{ lineHeight: 20 }}>
              {contact.notes}
            </Text>
          </Card>
        )}

        {/* Linked Notes Card (Mock) */}
        {contact.linkedNotes.length > 0 && (
          <Card style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Text variant="captionStrong" color="textMuted">
                LINKED VAULT NOTES ({contact.linkedNotes.length})
              </Text>
              <Icon name="link-outline" size={16} color={theme.colors.accent} />
            </View>

            <View style={styles.linksList}>
              {contact.linkedNotes.map((note) => (
                <TouchableOpacity
                  key={note.id}
                  activeOpacity={0.7}
                  onPress={() => handleAction("Open Note", note.title)}
                  style={[
                    styles.linkedItem,
                    { backgroundColor: theme.colors.surfaceAlt },
                  ]}
                >
                  <Icon
                    name="document-text-outline"
                    size={18}
                    color={theme.colors.accent}
                  />
                  <View style={styles.linkedInfo}>
                    <Text variant="bodyStrong" color="text">
                      {note.title}
                    </Text>
                    <Text variant="caption" color="textMuted">
                      {note.date}
                    </Text>
                  </View>
                  <Icon
                    name="chevron-forward"
                    size={16}
                    color={theme.colors.textSubtle}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        {/* Linked Diary Entries Card (Mock) */}
        {contact.linkedDiaryEntries.length > 0 && (
          <Card style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Text variant="captionStrong" color="textMuted">
                LINKED DIARY ENTRIES ({contact.linkedDiaryEntries.length})
              </Text>
              <Icon name="book-outline" size={16} color={theme.colors.accent} />
            </View>

            <View style={styles.linksList}>
              {contact.linkedDiaryEntries.map((entry) => (
                <TouchableOpacity
                  key={entry.id}
                  activeOpacity={0.7}
                  onPress={() => handleAction("Open Diary Entry", entry.title)}
                  style={[
                    styles.linkedItem,
                    { backgroundColor: theme.colors.surfaceAlt },
                  ]}
                >
                  <Icon
                    name="journal-outline"
                    size={18}
                    color={theme.colors.accent}
                  />
                  <View style={styles.linkedInfo}>
                    <Text variant="bodyStrong" color="text">
                      {entry.title}
                    </Text>
                    <Text variant="caption" color="textMuted">
                      {entry.date} • Mood: {entry.mood}
                    </Text>
                  </View>
                  <Icon
                    name="chevron-forward"
                    size={16}
                    color={theme.colors.textSubtle}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        {/* Delete Contact Button */}
        <Button
          title="Delete Contact"
          variant="danger"
          onPress={handleDelete}
          style={{ marginTop: 8 }}
        />
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
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  heroCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarInitials: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  heroName: {
    fontSize: 22,
    fontWeight: "700",
  },
  heroOrg: {
    marginTop: 4,
  },
  labelsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
  },
  heroDivider: {
    marginVertical: 18,
    width: "100%",
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 8,
  },
  quickActionBtn: {
    alignItems: "center",
    gap: 6,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  cardHeader: {
    fontSize: 11,
    letterSpacing: 0.8,
  },
  dataList: {
    gap: 12,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dataLeft: {
    gap: 2,
  },
  labelCapital: {
    textTransform: "capitalize",
    fontSize: 11,
  },
  rowActionBtn: {
    padding: 8,
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linksList: {
    gap: 8,
  },
  linkedItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  linkedInfo: {
    flex: 1,
    gap: 2,
  },
});
