/**
 * Contacts Zustand store (mock, in-memory)
 */

import { create } from "zustand";
import {
  mockContacts,
  mockDuplicatePairs,
  type Contact,
  type DuplicatePair,
} from "../mock";

interface ContactsState {
  contacts: Contact[];
  duplicatePairs: DuplicatePair[];

  // Actions
  getContactById: (id: string) => Contact | undefined;
  toggleStarred: (id: string) => void;
  addContact: (data: Omit<Contact, "id" | "linkedNotes" | "linkedDiaryEntries">) => string;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  mergeDuplicates: (pairId: string, primaryId: string) => void;
  dismissDuplicate: (pairId: string) => void;
}

export const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: mockContacts,
  duplicatePairs: mockDuplicatePairs,

  getContactById: (id) => {
    return get().contacts.find((c) => c.id === id);
  },

  toggleStarred: (id) => {
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id ? { ...c, starred: !c.starred } : c
      ),
    }));
  },

  addContact: (data) => {
    const id = `contact_${Date.now()}`;
    const newContact: Contact = {
      ...data,
      id,
      linkedNotes: [],
      linkedDiaryEntries: [],
    };
    set((state) => ({
      contacts: [...state.contacts, newContact],
    }));
    return id;
  },

  updateContact: (id, updates) => {
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  },

  deleteContact: (id) => {
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
      duplicatePairs: state.duplicatePairs.filter(
        (p) => p.contactA.id !== id && p.contactB.id !== id
      ),
    }));
  },

  mergeDuplicates: (pairId, primaryId) => {
    const pair = get().duplicatePairs.find((p) => p.id === pairId);
    if (!pair) return;

    const primary = primaryId === pair.contactA.id ? pair.contactA : pair.contactB;
    const secondary = primaryId === pair.contactA.id ? pair.contactB : pair.contactA;

    // Merge phone numbers (unique)
    const phoneMap = new Map<string, string>();
    primary.phones.forEach((p) => phoneMap.set(p.number, p.label));
    secondary.phones.forEach((p) => {
      if (!phoneMap.has(p.number)) phoneMap.set(p.number, p.label);
    });
    const mergedPhones = Array.from(phoneMap.entries()).map(([number, label]) => ({
      number,
      label: label as any,
    }));

    // Merge email addresses (unique)
    const emailMap = new Map<string, string>();
    primary.emails.forEach((e) => emailMap.set(e.address.toLowerCase(), e.label));
    secondary.emails.forEach((e) => {
      if (!emailMap.has(e.address.toLowerCase())) emailMap.set(e.address.toLowerCase(), e.label);
    });
    const mergedEmails = Array.from(emailMap.entries()).map(([address, label]) => ({
      address,
      label: label as any,
    }));

    // Merge labels
    const mergedLabels = Array.from(new Set([...primary.labels, ...secondary.labels]));

    // Merge linked notes and diary
    const mergedNotes = [...primary.linkedNotes, ...secondary.linkedNotes];
    const mergedDiary = [...primary.linkedDiaryEntries, ...secondary.linkedDiaryEntries];

    const mergedContact: Contact = {
      ...primary,
      phones: mergedPhones,
      emails: mergedEmails,
      labels: mergedLabels,
      notes: [primary.notes, secondary.notes].filter(Boolean).join("\n\n"),
      linkedNotes: mergedNotes,
      linkedDiaryEntries: mergedDiary,
    };

    set((state) => ({
      contacts: state.contacts
        .filter((c) => c.id !== secondary.id)
        .map((c) => (c.id === primary.id ? mergedContact : c)),
      duplicatePairs: state.duplicatePairs.filter((p) => p.id !== pairId),
    }));
  },

  dismissDuplicate: (pairId) => {
    set((state) => ({
      duplicatePairs: state.duplicatePairs.filter((p) => p.id !== pairId),
    }));
  },
}));
